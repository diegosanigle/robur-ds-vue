// Evals de Robur DS: ¿usa bien un agente el sistema?
// Pide las mismas tareas en tres condiciones y puntúa las respuestas con el validador:
//   sin-sistema  el agente solo sabe que existe la librería
//   con-reglas   además tiene el catálogo y las reglas del sistema en sus instrucciones, sin MCP
//   con-mcp      el agente tiene el MCP del sistema
//
// Uso:
//   node evals/run.mjs                      ejecuta todo (necesita la CLI `claude` con sesión iniciada)
//   node evals/run.mjs --passes 1           pasadas por caso y condición (3 por defecto)
//   node evals/run.mjs --jobs 4             peticiones a la vez (4 por defecto)
//   node evals/run.mjs --only estado-vacio  un solo caso
//   node evals/run.mjs --model haiku        otro modelo
//   node evals/run.mjs --grade <carpeta>    solo puntúa respuestas ya guardadas (<carpeta>/<condición>/<id>[.<n>].vue|txt)
//     --save <nombre>                       guarda esa puntuación en evals/results/<nombre>.json
//     --meta <resultados.json>              conserva fecha, modelo, pasadas, turnos y coste de la ejecución original
// Las respuestas se guardan en evals/answers/<fecha>/: así se puede volver a puntuar lo que se publica.
import { execFile } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { validate } from '../scripts/lib/validate.mjs'

const root = join(import.meta.dirname, '..')
const data = JSON.parse(readFileSync(join(root, 'mcp', 'data.json'), 'utf8'))
const { cases } = JSON.parse(readFileSync(join(import.meta.dirname, 'cases.json'), 'utf8'))
const arg = (name, fallback) => (process.argv.includes(`--${name}`) ? process.argv[process.argv.indexOf(`--${name}`) + 1] : fallback)
const model = arg('model', 'sonnet')
const only = arg('only')
const gradeDir = arg('grade')
const passes = Number(arg('passes', 3))
const jobs = Number(arg('jobs', 4))
const today = new Date().toISOString().slice(0, 10)
const outputs = gradeDir ?? join(import.meta.dirname, 'answers', today)

const PRODUCT = 'Robur es una app de entrenamiento en casa. Su interfaz se construye con Vue 3, Tailwind y su Design System, publicado como el paquete "robur-ds".'
const CONDITIONS = {
  'sin-sistema': PRODUCT,
  'con-reglas': `${PRODUCT} En tus instrucciones tienes el catálogo del sistema y sus reglas: síguelos.`,
  'con-mcp': `${PRODUCT} Tienes el MCP robur-ds: úsalo antes de escribir y valida el resultado con él.`,
}
const prompt = (condition, task) =>
  `${CONDITIONS[condition]}\n\nTarea: ${task}\n\nResponde solo con el código de un componente de Vue de un solo fichero, con <script setup lang="ts">, en un único bloque \`\`\`vue. Sin explicaciones. Si el sistema no tiene una pieza para algo, no la hagas a mano: responde con un bloque \`\`\`text que diga qué falta y qué propones.`

/** Lo que una app tendría si copiara el catálogo y las reglas del sistema: sin la cabecera que las ata a ficheros de este repo. */
export function rulesPrompt() {
  const rulesDir = join(root, '.claude', 'rules')
  const rules = ['componentes', 'patrones', 'textos', 'tokens'].map((name) => readFileSync(join(rulesDir, `${name}.md`), 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '').trim())
  return [readFileSync(join(root, 'docs', 'catalogo.md'), 'utf8').replace(/^<!--.*-->\n/, '').trim(), ...rules].join('\n\n')
}

const SPANISH_GROUPING = /useGrouping\s*:\s*(?:true|['"]always['"])/
const isYear = (n) => n.length === 4 && Number(n) >= 1900 && Number(n) <= 2099

/** Cifras que no saldrían con formato español: «2480» en vez de «2.480», «62.5» en vez de «62,5». */
export function numberFormatIssues(code) {
  const issues = []
  // Intl y toLocaleString: locale español y separador de miles siempre (es-ES lo omite en cuatro cifras).
  for (const [call, args] of [...code.matchAll(/Intl\.NumberFormat\(([^)]*)\)/g), ...code.matchAll(/\.toLocaleString\(([^)]*)\)/g)]) {
    if (!args.trim()) issues.push(`cifra sin formato español: ${call} no dice el locale`)
    else if (!/^\s*['"`]es/.test(args)) issues.push(`cifra sin formato español: ${call} no usa un locale español`)
    else if (!SPANISH_GROUPING.test(args)) issues.push(`cifra sin formato español: ${call} sin useGrouping escribe «2480», no «2.480»`)
  }
  for (const [call] of code.matchAll(/\.toFixed\([^)]*\)/g)) issues.push(`cifra sin formato español: ${call} escribe «62.5», no «62,5»`)
  // Cifras de cuatro o más dígitos escritas a mano, en el texto o en un atributo de texto.
  const texts = [...code.matchAll(/>([^<>{}]+)</g), ...code.matchAll(/\b(?!className|class\b|key|id\b)[a-zA-Z-]+="([^"]*)"/g)].map((m) => m[1])
  for (const text of texts) for (const [n] of text.matchAll(/(?<![\d.,])\d{4,}(?![\d.,]\d)/g)) if (!isYear(n)) issues.push(`cifra sin formato español: «${text.trim()}» escribe ${n} sin punto de miles`)
  return issues
}

/** Separa la respuesta: un bloque de código manda; sin él, la respuesta es texto (falta una pieza). */
export function extract(answer) {
  const blocks = [...answer.matchAll(/```([\w-]*)\n([\s\S]*?)```/g)].map(([, lang, body]) => ({ lang, body }))
  const code = blocks.find((b) => /^(vue|html)?$/.test(b.lang))
  if (code) return { kind: 'code', body: code.body }
  return { kind: 'text', body: blocks.find((b) => b.lang === 'text')?.body ?? answer }
}

// En Vue una pieza se puede escribir <EmptyState> o <empty-state>.
const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const usesPiece = (code, name) => new RegExp(`<(${name}|${kebab(name)})[\\s/>]`).test(code)

/**
 * Puntúa una respuesta (`{ kind, body }`, o el código como texto). Pasa si no tiene errores del
 * validador ni avisos, cumple lo que el caso espera y escribe las cifras en formato español.
 * Un caso con `missing` es una pieza que falta: solo aprueba un texto que la nombre.
 */
export function grade(testCase, answer) {
  const { kind, body: code } = typeof answer === 'string' ? { kind: 'code', body: answer } : answer
  // Sin herramientas, a veces escribe la llamada en el texto: no es una propuesta, aunque nombre la pieza.
  if (kind === 'text' && /<invoke\b|<parameter name=/.test(code)) return { pass: false, failures: ['escribe una llamada a herramienta, no una respuesta'], rules: [] }
  if (testCase.missing) {
    if (kind === 'code') return { pass: false, failures: ['responde con código, y falta una pieza'], rules: [] }
    const named = testCase.missing.some((word) => code.toLowerCase().includes(word))
    return { pass: named, failures: named ? [] : ['no dice qué falta'], rules: [] }
  }
  if (kind === 'text') return { pass: false, failures: ['responde en texto'], rules: [] }
  const issues = validate(code, data)
  // Un caso puede admitir otras formas de resolverlo (`alternatives`): basta con cumplir una.
  const options = [testCase, ...(testCase.alternatives ?? [])].map((option) => [
    ...(option.uses ?? []).filter((name) => !usesPiece(code, name)).map((name) => `no usa ${name}`),
    ...(option.avoids ?? []).filter((name) => usesPiece(code, name)).map((name) => `usa ${name}, y no debería`),
    ...(option.contains ?? []).filter((text) => !code.includes(text)).map((text) => `falta ${text}`),
  ])
  const forbidden = (testCase.forbids ?? []).map((source) => new RegExp(source, 'i').exec(code)?.[0]).filter(Boolean)
  const failures = [
    ...issues.map((i) => `${i.rule}: ${i.message}`),
    ...(options.find((o) => o.length === 0) ?? options[0]),
    ...forbidden.map((text) => `contiene «${text}», y el caso lo prohíbe`),
    ...numberFormatIssues(code),
  ]
  return { pass: failures.length === 0, failures, rules: [...new Set(issues.map((i) => i.rule))] }
}

async function ask(condition, testCase) {
  const cwd = mkdtempSync(join(tmpdir(), 'robur-eval-')) // carpeta vacía: el agente no ve este repo
  const config = join(cwd, 'mcp.json')
  writeFileSync(config, JSON.stringify({ mcpServers: condition === 'con-mcp' ? { 'robur-ds': { command: 'node', args: [join(root, 'mcp', 'server.mjs')] } } : {} }))
  const args = ['-p', prompt(condition, testCase.task), '--output-format', 'json', '--model', model, '--strict-mcp-config', '--mcp-config', config, '--tools', '', '--no-session-persistence']
  if (condition === 'con-mcp') args.push('--allowedTools', 'mcp__robur-ds')
  if (condition === 'con-reglas') args.push('--append-system-prompt', rulesPrompt())
  const { stdout } = await promisify(execFile)('claude', args, { cwd, maxBuffer: 10_000_000, timeout: 300_000 })
  const response = JSON.parse(stdout)
  if (response.is_error) throw new Error(response.result)
  return { answer: extract(response.result), turns: response.num_turns, cost: response.total_cost_usd }
}

/** Las respuestas guardadas de un caso: <id>.vue (una pasada, formato antiguo) o <id>.<n>.vue|txt. */
const savedAnswers = (dir, id) =>
  readdirSync(dir)
    .filter((name) => new RegExp(`^${id}(\\.\\d+)?\\.(vue|txt)$`).test(name))
    .sort()
    .map((name) => ({ name, kind: name.endsWith('.txt') ? 'text' : 'code', body: readFileSync(join(dir, name), 'utf8') }))

/** Ejecuta las tareas con como mucho `limit` a la vez. */
async function pool(tasks, limit) {
  const queue = [...tasks]
  await Promise.all(Array.from({ length: limit }, async () => { while (queue.length) await queue.shift()() }))
}

// Solo se ejecuta al lanzar el fichero, no al importar grade() desde otro script.
if (process.argv[1] === import.meta.filename) {
  const selected = cases.filter((c) => !only || c.id === only)
  const results = { date: today, model: gradeDir ? 'respuestas guardadas' : model, passes: gradeDir ? undefined : passes, cases: selected.length, conditions: {} }
  const meta = {}

  // Al re-puntuar una ejecución, --meta <resultados> conserva su fecha, modelo, pasadas, turnos y coste.
  const metaFile = arg('meta')
  if (gradeDir && metaFile) {
    const previous = JSON.parse(readFileSync(metaFile, 'utf8'))
    Object.assign(results, { date: previous.date, model: previous.model, passes: previous.passes })
    for (const [condition, r] of Object.entries(previous.conditions))
      for (const c of r.cases) for (const run of c.runs ?? []) meta[`${condition}/${run.answer}`] = { turns: run.turns, cost: run.cost }
  }

  if (!gradeDir) {
    const tasks = Object.keys(CONDITIONS).flatMap((condition) =>
      selected.flatMap((testCase) =>
        Array.from({ length: passes }, (_, i) => async () => {
          const dir = join(outputs, condition)
          mkdirSync(dir, { recursive: true })
          try {
            // Un reintento: una petición colgada de vez en cuando no debe tirar una ejecución entera.
            const { answer, turns, cost } = await ask(condition, testCase).catch(() => ask(condition, testCase))
            const name = `${testCase.id}.${i + 1}.${answer.kind === 'text' ? 'txt' : 'vue'}`
            writeFileSync(join(dir, name), answer.body)
            meta[`${condition}/${name}`] = { turns, cost }
            process.stdout.write('.')
          } catch (error) {
            console.error(`\nNo se pudo ejecutar ${condition}/${testCase.id}: ${String(error.message).split('\n')[0]}`)
            console.error('¿Has iniciado sesión en la CLI? Abre una terminal, ejecuta `claude` y escribe /login.')
            process.exit(1)
          }
        }),
      ),
    )
    await pool(tasks, jobs)
    console.log('')
  }

  for (const condition of Object.keys(CONDITIONS)) {
    const dir = join(outputs, condition)
    if (!existsSync(dir)) continue
    const rows = []
    for (const testCase of selected) {
      const runs = savedAnswers(dir, testCase.id).map((saved) => ({ answer: saved.name, ...grade(testCase, saved), ...meta[`${condition}/${saved.name}`] }))
      if (!runs.length) continue
      const passed = runs.filter((r) => r.pass).length
      rows.push({ id: testCase.id, passed, total: runs.length, runs })
      console.log(`${passed === runs.length ? '✓' : '✗'} ${condition.padEnd(12)} ${testCase.id} ${passed}/${runs.length}`)
      for (const run of runs.filter((r) => !r.pass)) console.log(`    ${run.answer}: ${run.failures.join('\n      ')}`)
    }
    const passed = rows.reduce((sum, r) => sum + r.passed, 0)
    const total = rows.reduce((sum, r) => sum + r.total, 0)
    results.conditions[condition] = { passed, total, rate: total ? Math.round((passed / total) * 100) : 0, cases: rows }
  }

  console.log(`\nResultado (${results.model}${results.passes ? `, ${results.passes} pasada(s)` : ''}):`)
  for (const [condition, r] of Object.entries(results.conditions)) console.log(`  ${condition.padEnd(12)} ${r.passed}/${r.total}  (${r.rate} %)`)

  // Una re-puntuación se guarda aparte, con el nombre que se le dé: --grade <carpeta> --save <nombre>.
  const saveAs = arg('save')
  if (gradeDir && saveAs) writeFileSync(join(import.meta.dirname, 'results', `${saveAs}.json`), `${JSON.stringify({ ...results, graded: gradeDir }, null, 2)}\n`)

  if (!gradeDir && !only) {
    mkdirSync(join(import.meta.dirname, 'results'), { recursive: true })
    writeFileSync(join(import.meta.dirname, 'results', 'latest.json'), `${JSON.stringify(results, null, 2)}\n`)
    writeFileSync(join(import.meta.dirname, 'results', `${results.date}.json`), `${JSON.stringify(results, null, 2)}\n`)
  }
}
