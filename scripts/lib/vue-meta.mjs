// Lee de un componente .vue lo que su contrato describe: props, eventos y slots, con sus tipos.
// Usa vue-component-meta, la misma librería con la que Storybook genera la tabla de props.
//
// Cómo se corresponde Vue con el contrato, que es el mismo en todas las tecnologías:
// - una prop                → una prop del contrato;
// - un evento `change`      → la prop función `onChange`;
// - el slot por defecto     → la prop `children`, de tipo node;
// - `modelValue` (v-model)  → nada: es el `value` o el `checked` del elemento nativo, que el contrato da por heredado.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createChecker } from 'vue-component-meta'
import { root } from './tokens.mjs'

const checker = createChecker(join(root, 'tsconfig.app.json'), { forceUseTs: true })
const capitalize = (text) => text[0].toUpperCase() + text.slice(1)

function typeOf(text) {
  const parts = text.split(' | ').filter((part) => part !== 'undefined')
  if (parts.every((part) => /^".*"$/.test(part))) return { type: 'enum', values: parts.map((part) => JSON.parse(part)) }
  if (parts.length === 1 && parts[0].endsWith('[]')) return { type: 'array' }
  return { type: parts.join(' | ') } // boolean, string, number
}

/** Las props propias del componente, en la forma del contrato, con el comentario de cada una. */
export function propsFromCode(folder, name) {
  const file = join(root, 'src', folder, name, `${name}.vue`)
  const meta = checker.getComponentMeta(file)
  const out = []

  for (const p of meta.props) {
    if (p.global || p.name === 'modelValue') continue
    const prop = { name: p.name, ...typeOf(p.type) }
    if (p.required) prop.required = true
    if (p.default !== undefined) prop.default = JSON.parse(p.default)
    out.push({ prop, description: p.description })
  }
  for (const e of meta.events) {
    if (e.name.startsWith('update:')) continue
    // Un evento no puede ser obligatorio en Vue: `required` no se compara (ver check-contracts).
    out.push({ prop: { name: `on${capitalize(e.name)}`, type: 'function' }, description: e.description, event: true })
  }
  const slot = meta.slots.find((s) => s.name === 'default')
  if (slot) {
    const prop = { name: 'children', type: 'node' }
    // `default(): …` es obligatorio; `default?(): …` es opcional.
    if (!/\bdefault\?\s*\(/.test(readFileSync(file, 'utf8'))) prop.required = true
    out.push({ prop, description: slot.description })
  }
  return out
}
