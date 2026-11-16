// Prueba al examinador: una respuesta mala conocida debe suspender y una buena debe aprobar.
// Si el corrector se equivoca con estas dos, sus notas no valen.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { grade } from '../evals/run.mjs'
import { root } from './lib/tokens.mjs'

const { cases } = JSON.parse(readFileSync(join(root, 'evals', 'cases.json'), 'utf8'))
const testCase = cases.find((c) => c.id === 'estado-vacio')
const read = (kind) => readFileSync(join(root, 'evals', 'fixtures', kind, 'estado-vacio.vue'), 'utf8')
const bad = grade(testCase, read('mala'))
const good = grade(testCase, read('buena'))
const errors = []

if (bad.pass) errors.push('la respuesta mala aprueba')
for (const rule of ['unknown-class', 'no-arbitrary', 'no-raw-control', 'neutral-copy']) {
  if (!bad.rules.includes(rule)) errors.push(`la respuesta mala no dispara ${rule}`)
}
if (!bad.failures.includes('no usa EmptyState')) errors.push('no detecta que falta el patrón')
if (!good.pass) errors.push(`la respuesta buena suspende: ${good.failures.join('; ')}`)
for (const c of cases) if (!c.uses?.length || !c.why) errors.push(`el caso ${c.id} no dice qué debe usar o por qué`)
for (const c of cases) for (const alt of c.alternatives ?? []) if (!alt.uses?.length) errors.push(`una alternativa del caso ${c.id} no dice qué debe usar`)

// Una alternativa válida también aprueba: la confirmación con el patrón ConfirmSheet (respuesta real de un agente).
const confirm = grade(cases.find((c) => c.id === 'borrar-sesion'), readFileSync(join(root, 'evals', 'fixtures', 'buena', 'borrar-sesion.vue'), 'utf8'))
if (!confirm.pass) errors.push(`la confirmación con ConfirmSheet suspende: ${confirm.failures.join('; ')}`)

if (errors.length) {
  console.error(`Evals: ${errors.length} problema(s) en el corrector\n- ${errors.join('\n- ')}`)
  process.exit(1)
}
console.log(`Evals: ${cases.length} casos; el corrector suspende la respuesta mala (${bad.failures.length} fallos) y aprueba la buena.`)
