// Comprueba la paridad: que cada componente tenga en Figma las propiedades que dice su contrato.
// Compara los contratos con figma/library.json, la foto que genera scripts/figma/snapshot.js.
// Uso: node scripts/check-figma.mjs
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { root } from './lib/tokens.mjs'

const dir = join(root, 'src', 'components')
const library = JSON.parse(readFileSync(join(root, 'figma', 'library.json'), 'utf8')).components
const errors = []
const show = (p) => `${p.name} (${p.type}${p.values ? `: ${p.values.join(', ')}` : ''})`

/** La propiedad de Figma que le corresponde a una prop del contrato, o null si no tiene. */
function expected(prop, rule) {
  if (typeof rule === 'string') return { name: prop.name, type: rule } // TEXT o SLOT
  if (rule?.values) return { name: prop.name, type: 'VARIANT', values: rule.values }
  if (prop.type === 'enum') return { name: prop.name, type: 'VARIANT', values: prop.values }
  if (prop.type === 'boolean') return { name: prop.name, type: 'VARIANT', values: ['false', 'true'] }
  if (prop.type === 'string') return { name: prop.name, type: 'TEXT' }
  return null // function, array, number y node no tienen equivalente salvo que el contrato lo diga
}

for (const name of readdirSync(dir).sort()) {
  const fail = (message) => errors.push(`${name}: ${message}`)
  const contract = JSON.parse(readFileSync(join(dir, name, `${name}.contract.json`), 'utf8'))
  const figma = library[name]
  if (!figma) {
    fail('no existe en Figma')
    continue
  }
  const rules = contract.figma?.props ?? {}
  const wanted = []

  for (const prop of contract.props) {
    const rule = rules[prop.name]
    if (rule?.omit) continue // excepción con su motivo escrito
    if (rule?.via) {
      // La prop vive en un componente interior que se ve desde fuera.
      const [inner, innerProp] = rule.via.split('.')
      if (!figma.exposed.includes(inner)) fail(`"${prop.name}" debería llegar por ${inner}, que no está expuesto en Figma`)
      else if (!library[inner]?.properties.some((p) => p.name === innerProp)) fail(`"${prop.name}" apunta a ${rule.via}, que no existe`)
      continue
    }
    const property = expected(prop, rule)
    if (property) wanted.push(property)
    else if (prop.type === 'node') fail(`"${prop.name}" es contenido: el contrato debe decir si en Figma es TEXT, SLOT u omit`)
  }
  for (const extra of contract.figma?.extra ?? []) {
    if (extra.name === 'state') {
      const unknown = extra.values.filter((v) => !contract.states.includes(v))
      if (unknown.length) fail(`el estado "${unknown}" está en Figma y no en "states" del contrato`)
    }
    wanted.push(extra)
  }

  for (const property of wanted) {
    const found = figma.properties.find((p) => p.name === property.name)
    if (!found) fail(`falta en Figma la propiedad ${show(property)}`)
    else if (found.type !== property.type || JSON.stringify(found.values) !== JSON.stringify(property.values)) {
      fail(`la propiedad no coincide. Contrato: ${show(property)} · Figma: ${show(found)}`)
    }
  }
  for (const found of figma.properties) {
    if (!wanted.some((p) => p.name === found.name)) fail(`Figma tiene la propiedad ${show(found)}, que no está en el contrato`)
  }
  if (figma.unboundFills) fail(`${figma.unboundFills} relleno(s) en Figma con un color a mano en lugar de una variable`)
}

for (const name of Object.keys(library)) {
  if (!readdirSync(dir).includes(name)) errors.push(`${name}: existe en Figma y no en el código`)
}

if (errors.length) {
  console.error(`Paridad con Figma: ${errors.length} problema(s)\n- ${errors.join('\n- ')}`)
  process.exit(1)
}
console.log(`Paridad con Figma: ${Object.keys(library).length} componentes, todos coinciden con su contrato.`)
