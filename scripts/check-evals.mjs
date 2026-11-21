// Prueba al examinador: una respuesta mala conocida debe suspender y una buena debe aprobar.
// Si el corrector se equivoca con estas dos, sus notas no valen.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { extract, grade, numberFormatIssues, rulesPrompt } from '../evals/run.mjs'
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
for (const c of cases) if (!(c.uses?.length || c.missing?.length) || !c.why) errors.push(`el caso ${c.id} no dice qué debe usar (o qué falta) o por qué`)
if (cases.length !== 12) errors.push(`hay ${cases.length} casos, y son 12`)
if (new Set(cases.map((c) => c.id)).size !== cases.length) errors.push('hay ids de caso repetidos')

// La condición con-reglas pega el catálogo y las reglas, sin la cabecera que las ata a ficheros del repo.
const rules = rulesPrompt()
if (!rules.includes('Catálogo de Robur DS')) errors.push('con-reglas no lleva el catálogo')
if (!rules.includes('Textos de la interfaz')) errors.push('con-reglas no lleva la regla de textos')
if (/^paths:/m.test(rules)) errors.push('con-reglas lleva la cabecera paths: de las reglas')
for (const c of cases) for (const alt of c.alternatives ?? []) if (!alt.uses?.length) errors.push(`una alternativa del caso ${c.id} no dice qué debe usar`)

// Una alternativa válida también aprueba: la confirmación con el patrón ConfirmSheet (respuesta real de un agente).
const confirm = grade(cases.find((c) => c.id === 'borrar-sesion'), readFileSync(join(root, 'evals', 'fixtures', 'buena', 'borrar-sesion.vue'), 'utf8'))
if (!confirm.pass) errors.push(`la confirmación con ConfirmSheet suspende: ${confirm.failures.join('; ')}`)

// Cifras: «2480» en vez de «2.480» y «62.5» en vez de «62,5» suspenden; un año no es una cifra.
const fixture = (kind, name) => readFileSync(join(root, 'evals', 'fixtures', kind, name), 'utf8')
const badNumbers = numberFormatIssues(fixture('mala', 'cifras.vue'))
if (badNumbers.length !== 5) errors.push(`la regla de cifras encuentra ${badNumbers.length} fallos en la respuesta mala, y son 5: ${badNumbers.join('; ')}`)
const goodNumbers = numberFormatIssues(fixture('buena', 'cifras.vue'))
if (goodNumbers.length) errors.push(`la regla de cifras suspende la respuesta buena: ${goodNumbers.join('; ')}`)

// Falta una pieza: solo aprueba un texto que diga qué falta. El código suspende.
const missingCase = { id: 'aviso-prueba', missing: ['aviso', 'toast', 'notificación'], why: 'prueba' }
if (!grade(missingCase, { kind: 'text', body: fixture('buena', 'aviso-guardado.txt') }).pass) errors.push('el texto que nombra el aviso que falta suspende')
const handMade = grade(missingCase, { kind: 'code', body: fixture('mala', 'aviso-guardado.vue') })
if (handMade.pass || !handMade.failures.includes('responde con código, y falta una pieza')) errors.push('el aviso hecho a mano no suspende por responder con código')
const vague = grade(missingCase, { kind: 'text', body: 'No se puede hacer con lo que hay.' })
if (vague.pass || !vague.failures.includes('no dice qué falta')) errors.push('un texto que no nombra lo que falta aprueba')
// Sin herramientas, el agente a veces escribe una llamada a herramienta en el texto. No es una propuesta,
// aunque mencione la pieza (aquí, «Toast» dentro de un patrón de búsqueda).
const fakeCall = grade(missingCase, { kind: 'text', body: '<invoke name="Grep">\n<parameter name="pattern">Toast|Snackbar</parameter>\n</invoke>' })
if (fakeCall.pass || !fakeCall.failures.includes('escribe una llamada a herramienta, no una respuesta')) errors.push('una llamada a herramienta fingida aprueba un caso de pieza que falta')
const textForCode = grade(testCase, { kind: 'text', body: 'Falta un estado vacío.' })
if (textForCode.pass || !textForCode.failures.includes('responde en texto')) errors.push('responder en texto a un caso que tiene pieza aprueba')

// extract: un bloque de código manda sobre uno de texto; sin bloques, la respuesta es texto.
const mixed = extract('```text\nFalta un aviso.\n```\n\n```vue\nexport const A = 1\n```')
if (mixed.kind !== 'code' || !mixed.body.includes('export const A')) errors.push('una respuesta con texto y código no se puntúa como código')
if (extract('Falta un aviso: no hay toast.').kind !== 'text') errors.push('una respuesta sin bloques no se puntúa como texto')
if (extract('```text\nFalta un calendario.\n```').kind !== 'text') errors.push('un bloque text no se puntúa como texto')

// Patrones prohibidos: registrar-sesion no puede añadir recuentos ni progreso.
const counted = grade(cases.find((c) => c.id === 'registrar-sesion'), fixture('mala', 'registrar-sesion.vue'))
if (counted.pass || !counted.failures.some((f) => f.startsWith('contiene'))) errors.push('el recuento «3/5 completados» no suspende registrar-sesion')
// forbids mira el texto que se ve, no el código: un «100%» en un comentario o una medida no es un recuento.
const notVisible = grade(cases.find((c) => c.id === 'registrar-sesion'), fixture('mala', 'registrar-sesion.vue').replace('<p class="text-body text-secondary">3/5 completados</p>', '<!-- ocupa el 100% del ancho: 1/1 -->'))
if (notVisible.failures.some((f) => f.startsWith('contiene'))) errors.push(`forbids salta con texto que no se ve: ${notVisible.failures.join('; ')}`)

if (errors.length) {
  console.error(`Evals: ${errors.length} problema(s) en el corrector\n- ${errors.join('\n- ')}`)
  process.exit(1)
}
console.log(`Evals: ${cases.length} casos; el corrector suspende la respuesta mala (${bad.failures.length} fallos) y aprueba la buena.`)
