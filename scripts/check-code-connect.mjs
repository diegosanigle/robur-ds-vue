// Comprueba los ficheros de Code Connect sin Figma: ejecuta cada plantilla contra una instancia
// simulada con las propiedades de figma/library.json, en todas las combinaciones de variantes,
// y pasa cada snippet por el mismo validador que el MCP (validate_code).
// Avisa si una plantilla lee una propiedad que no existe en Figma, si deja alguna sin leer
// o si un snippet no pasa el validador.
// Uso: node scripts/check-code-connect.mjs
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { root } from './lib/tokens.mjs'
import { validate, format } from './lib/validate.mjs'

const library = JSON.parse(readFileSync(join(root, 'figma', 'library.json'), 'utf8')).components
const data = JSON.parse(readFileSync(join(root, 'mcp', 'data.json'), 'utf8'))
const dir = join(root, 'figma', 'code-connect')
const files = readdirSync(dir).filter((f) => f.endsWith('.figma.js'))
const errors = []
let snippets = 0

/** Todas las combinaciones de valores de las variantes de un componente. */
function combinations(properties) {
  let all = [{}]
  for (const p of properties.filter((p) => p.type === 'VARIANT')) {
    all = all.flatMap((c) => p.values.map((v) => ({ ...c, [p.name]: v })))
  }
  return all
}

/** Una instancia de Figma de mentira: responde como la de verdad y apunta lo que se le pregunta. */
function instance(component, values, used, fail) {
  const props = library[component]?.properties ?? []
  const find = (name, type) => {
    const p = props.find((p) => p.name === name)
    if (!p) fail(`lee "${name}", que no existe en ${component} de Figma`)
    else if (p.type !== type) fail(`lee "${name}" como ${type}, y en Figma es ${p.type}`)
    used.add(`${component}.${name}`)
    return p
  }
  return {
    getEnum(name, mapping) {
      if (!find(name, 'VARIANT')) return undefined
      const value = values[name]
      if (!(value in mapping)) fail(`el valor "${value}" de "${name}" no tiene traducción`)
      return mapping[value]
    },
    getString: (name) => (find(name, 'TEXT') ? `Texto de ${name}` : ''),
    getSlot: (name) => (find(name, 'SLOT') ? '…' : ''),
    findInstance(name) {
      if (!library[component].exposed.includes(name)) fail(`busca la instancia "${name}", que no está expuesta en Figma`)
      return instance(name, {}, used, fail)
    },
  }
}

const code = (strings, ...values) => strings.reduce((out, s, i) => out + s + (i < values.length ? values[i] : ''), '')

for (const file of files) {
  const name = file.replace('.figma.js', '')
  const source = readFileSync(join(dir, file), 'utf8')
  const problems = new Set()
  const fail = (message) => problems.add(message)
  if (!library[name]) fail('no existe en figma/library.json')
  else if (!source.includes(`node-id=${library[name].id.replace(':', '-')}`)) fail('la url no apunta al nodo de figma/library.json')

  // La plantilla se ejecuta tal cual, cambiando el import de Figma por la instancia simulada.
  const body = source.replace(/^import figma from 'figma'$/m, '').replace('export default', 'return')
  const run = new Function('figma', body)
  const used = new Set()
  for (const values of combinations(library[name]?.properties ?? [])) {
    const result = run({ selectedInstance: instance(name, values, used, fail), code })
    snippets++
    const issues = validate(result.example, data).filter((i) => i.severity === 'error')
    if (issues.length) fail(`snippet con ${JSON.stringify(values)}:\n    ${result.example}\n    ${format(issues)}`)
    if (!result.imports?.length || !result.id) fail('falta imports o id')
  }
  for (const p of library[name]?.properties ?? []) {
    if (!used.has(`${name}.${p.name}`)) fail(`no lee la propiedad "${p.name}" de Figma: el snippet no cambiaría al tocarla`)
  }
  for (const problem of problems) errors.push(`${name}: ${problem}`)
}

for (const name of Object.keys(library)) {
  if (!files.includes(`${name}.figma.js`)) errors.push(`${name}: está en Figma y no tiene fichero de Code Connect`)
}

if (errors.length) {
  console.error(`Code Connect: ${errors.length} problema(s)\n- ${errors.join('\n- ')}`)
  process.exit(1)
}
console.log(`Code Connect: ${files.length} componentes, ${snippets} snippets, todos pasan el validador.`)
