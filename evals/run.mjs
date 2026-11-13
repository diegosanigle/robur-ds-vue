// Evals de Robur DS: ¿usa bien un agente el sistema?
// Pide las mismas tareas en dos condiciones y puntúa las respuestas con el validador:
//   sin-sistema  el agente solo sabe que existe la librería
//   con-mcp      el agente tiene el MCP del sistema
//
// Uso:
//   node evals/run.mjs                      ejecuta todo (necesita la CLI `claude` con sesión iniciada)
//   node evals/run.mjs --only estado-vacio  un solo caso
//   node evals/run.mjs --model haiku        otro modelo
//   node evals/run.mjs --grade <carpeta>    solo puntúa respuestas ya guardadas (<carpeta>/<condición>/<id>.vue)
import { execFile } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
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
const outputs = gradeDir ?? join(import.meta.dirname, 'outputs')

const CONDITIONS = {
  'sin-sistema': 'Robur es una app de entrenamiento en casa. Su interfaz se construye con Vue 3, Tailwind y su Design System, publicado como el paquete "robur-ds".',
  'con-mcp': 'Robur es una app de entrenamiento en casa. Su interfaz se construye con Vue 3, Tailwind y su Design System, publicado como el paquete "robur-ds". Tienes el MCP robur-ds: úsalo antes de escribir y valida el resultado con él.',
}
const prompt = (condition, task) =>
  `${CONDITIONS[condition]}\n\nTarea: ${task}\n\nResponde solo con el código de un componente de Vue de un solo fichero, con <script setup lang="ts">, en un único bloque \`\`\`vue. Sin explicaciones.`

// En Vue una pieza se puede escribir <EmptyState> o <empty-state>.
const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const usesPiece = (code, name) => new RegExp(`<(${name}|${kebab(name)})[\\s/>]`).test(code)

/** Puntúa una respuesta. Pasa si no tiene errores del validador ni avisos y cumple lo que el caso espera. */
export function grade(testCase, code) {
  const issues = validate(code, data)
  const failures = [
    ...issues.map((i) => `${i.rule}: ${i.message}`),
    ...(testCase.uses ?? []).filter((name) => !usesPiece(code, name)).map((name) => `no usa ${name}`),
    ...(testCase.avoids ?? []).filter((name) => usesPiece(code, name)).map((name) => `usa ${name}, y no debería`),
    ...(testCase.contains ?? []).filter((text) => !code.includes(text)).map((text) => `falta ${text}`),
  ]
  return { pass: failures.length === 0, failures, rules: [...new Set(issues.map((i) => i.rule))] }
}

const extract = (answer) => /```(?:vue|html)?\n([\s\S]*?)```/.exec(answer)?.[1] ?? answer

async function ask(condition, testCase) {
  const cwd = mkdtempSync(join(tmpdir(), 'robur-eval-')) // carpeta vacía: el agente no ve este repo
  const config = join(cwd, 'mcp.json')
  writeFileSync(config, JSON.stringify({ mcpServers: condition === 'con-mcp' ? { 'robur-ds': { command: 'node', args: [join(root, 'mcp', 'server.mjs')] } } : {} }))
  const args = ['-p', prompt(condition, testCase.task), '--output-format', 'json', '--model', model, '--strict-mcp-config', '--mcp-config', config, '--tools', '', '--no-session-persistence']
  if (condition === 'con-mcp') args.push('--allowedTools', 'mcp__robur-ds')
  const { stdout } = await promisify(execFile)('claude', args, { cwd, maxBuffer: 10_000_000, timeout: 300_000 })
  const response = JSON.parse(stdout)
  if (response.is_error) throw new Error(response.result)
  return { code: extract(response.result), turns: response.num_turns, cost: response.total_cost_usd }
}

// Solo se ejecuta al lanzar el fichero, no al importar grade() desde otro script.
if (process.argv[1] === import.meta.filename) {
  const selected = cases.filter((c) => !only || c.id === only)
  const results = { date: new Date().toISOString().slice(0, 10), model: gradeDir ? 'respuestas guardadas' : model, conditions: {} }

  for (const condition of Object.keys(CONDITIONS)) {
    const dir = join(outputs, condition)
    if (gradeDir && !existsSync(dir)) continue
    mkdirSync(dir, { recursive: true })
    const rows = []
    for (const testCase of selected) {
      const file = join(dir, `${testCase.id}.vue`)
      let meta = {}
      if (!gradeDir) {
        try {
          const answer = await ask(condition, testCase)
          writeFileSync(file, answer.code)
          meta = { turns: answer.turns, cost: answer.cost }
        } catch (error) {
          console.error(`No se pudo ejecutar ${condition}/${testCase.id}: ${String(error.message).split('\n')[0]}`)
          console.error('¿Has iniciado sesión en la CLI? Abre una terminal, ejecuta `claude` y escribe /login.')
          process.exit(1)
        }
      }
      if (!existsSync(file)) continue
      const result = grade(testCase, readFileSync(file, 'utf8'))
      rows.push({ id: testCase.id, ...result, ...meta })
      console.log(`${result.pass ? '✓' : '✗'} ${condition.padEnd(12)} ${testCase.id}${result.failures.length ? `\n    ${result.failures.join('\n    ')}` : ''}`)
    }
    const passed = rows.filter((r) => r.pass).length
    results.conditions[condition] = { passed, total: rows.length, rate: rows.length ? Math.round((passed / rows.length) * 100) : 0, cases: rows }
  }

  console.log(`\nResultado (${results.model}):`)
  for (const [condition, r] of Object.entries(results.conditions)) console.log(`  ${condition.padEnd(12)} ${r.passed}/${r.total}  (${r.rate} %)`)

  if (!gradeDir && !only) {
    mkdirSync(join(import.meta.dirname, 'results'), { recursive: true })
    writeFileSync(join(import.meta.dirname, 'results', 'latest.json'), `${JSON.stringify(results, null, 2)}\n`)
    writeFileSync(join(import.meta.dirname, 'results', `${results.date}.json`), `${JSON.stringify(results, null, 2)}\n`)
  }
}
