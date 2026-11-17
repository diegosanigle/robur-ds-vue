// Genera figma/code-connect/<Componente>.figma.js: un fichero de Code Connect por componente de Figma.
// Lee el contrato de cada pieza (en mcp/data.json: qué props hay y cómo se traducen a Figma) y
// figma/library.json (el nodo de cada componente). Los ficheros son generados: no se editan a mano.
// Uso: node scripts/build-code-connect.mjs
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { root } from './lib/tokens.mjs'

const library = JSON.parse(readFileSync(join(root, 'figma', 'library.json'), 'utf8'))
const data = JSON.parse(readFileSync(join(root, 'mcp', 'data.json'), 'utf8'))
const out = join(root, 'figma', 'code-connect')
const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

// Sintaxis de Vue, la misma de los ejemplos de uso del catálogo.
const event = (prop) => kebab(prop.name.replace(/^on/, ''))
const syntax = {
  tag: (piece) => piece.name,
  component: (piece) => piece.name,
  source: (piece) => `src/components/${piece.name}/${piece.name}.vue`,
  imports: (piece) => `import { ${piece.name} } from "robur-ds"`,
  attr: (piece, prop) => prop,
  number: (attr, id) => `' :${attr}="' + ${id} + '"'`,
  required: (attr, id) => `' :${attr}="' + ${id} + '"'`,
  native: (name) => ` ${name}`,
  // Lo que no existe en Figma: una variable con su nombre, o un evento con su manejador.
  hole: (piece, prop) => (prop.type === 'function' ? ` @${event(prop)}="${prop.name}"` : ` :${prop.name}="${prop.name}"`),
  closed: false, // sin contenido, la etiqueta se cierra sola: <Icon name="home" />
}

/** Un objeto de JS con un valor de código por cada valor de Figma: { primary: 'primary' }. */
const map = (values, cast = (v) => `'${v}'`) => `{ ${values.map((v) => `'${v}': ${cast(v)}`).join(', ')} }`

function template(name, figma) {
  const piece = data.components[name]
  const rules = piece.figma?.props ?? {}
  const reads = [] // líneas que leen la instancia de Figma
  const attrs = [] // trozos del snippet, en el orden de las props del contrato
  let inner = '' // el contenido entre la etiqueta de apertura y la de cierre
  const inners = {} // instancias interiores, leídas una sola vez

  for (const prop of piece.props) {
    const rule = rules[prop.name]
    const id = prop.name
    const attr = syntax.attr(piece, prop.name)
    if (rule?.omit) {
      // No existe en Figma. Si es obligatoria, el snippet la deja enlazada a una variable con su nombre.
      if (prop.required && prop.name !== 'children') attrs.push(`'${syntax.hole(piece, prop)}'`)
      continue
    }
    if (prop.name === 'children') {
      if (rule === 'TEXT') {
        reads.push(`const children = instance.getString('children')`)
        inner = '${children}'
      } else if (rule === 'SLOT') {
        reads.push(`const children = instance.getSlot('children')`)
        inner = '\n  ${children}\n'
      }
      continue
    }
    if (rule?.via) {
      const [component, innerProp] = rule.via.split('.')
      const handle = component.toLowerCase()
      if (!inners[handle]) {
        inners[handle] = true
        reads.push(`const ${handle} = instance.findInstance('${component}')`)
      }
      reads.push(`const ${id} = ${handle}.getString('${innerProp}')`)
    } else if (rule?.values) {
      // En Figma es una variante con otros valores: un número en código (sessions) o una función presente o no (onSelect).
      reads.push(`const ${id} = instance.getEnum('${id}', ${map(rule.values, (v) => v)})`)
    } else if (prop.type === 'enum') {
      reads.push(`const ${id} = instance.getEnum('${id}', ${map(prop.values)})`)
    } else if (prop.type === 'boolean') {
      reads.push(`const ${id} = instance.getEnum('${id}', ${map(['false', 'true'], (v) => v)})`)
    } else if (prop.type === 'string') {
      reads.push(`const ${id} = instance.getString('${id}')`)
    } else continue

    // Cómo aparece la prop en el snippet: se omite cuando vale lo que vale por defecto.
    if (prop.type === 'number') attrs.push(syntax.number(attr, id))
    else if (prop.type === 'function') attrs.push(`(${id} ? '${syntax.hole(piece, prop)}' : '')`)
    else if (prop.type === 'boolean' && prop.required) attrs.push(syntax.required(attr, id))
    else if (prop.type === 'boolean') attrs.push(`(${id} ? ' ${attr}' : '')`)
    else if (prop.type === 'enum' && prop.default !== undefined) attrs.push(`(${id} !== '${prop.default}' ? ' ${attr}="' + ${id} + '"' : '')`)
    else if (prop.required) attrs.push(`' ${attr}="' + ${id} + '"'`)
    else attrs.push(`(${id} ? ' ${attr}="' + ${id} + '"' : '')`)
  }

  // Lo que solo existe en Figma: el estado dibujado y atributos nativos como placeholder.
  for (const extra of piece.figma?.extra ?? []) {
    if (extra.name === 'state') {
      reads.push(`const state = instance.getEnum('state', ${map(extra.values)})`)
      for (const native of ['checked', 'disabled'].filter((v) => extra.values.includes(v))) {
        attrs.push(`(state === '${native}' ? '${syntax.native(native)}' : '')`)
      }
    } else if (extra.type === 'TEXT') {
      reads.push(`const ${extra.name} = instance.getString('${extra.name}')`)
      attrs.push(`(${extra.name} ? ' ${extra.name}="' + ${extra.name} + '"' : '')`)
    }
  }

  const tag = syntax.tag(piece)
  const url = `${library.fileUrl}?node-id=${figma.id.replace(':', '-')}`
  const open = attrs.length ? `<${tag}\${${attrs.join(' + ')}}` : `<${tag}`
  const example = inner || syntax.closed ? `${open}>${inner}</${tag}>` : `${open} />`
  return `// url=${url}
// source=${syntax.source(piece)}
// component=${syntax.component(piece)}
// Generado por scripts/build-code-connect.mjs desde el contrato y figma/library.json. No se edita a mano.
import figma from 'figma'
${reads.length ? `\nconst instance = figma.selectedInstance\n${reads.join('\n')}\n` : ''}
export default {
  example: figma.code\`${example}\`,
  imports: ['${syntax.imports(piece)}'],
  id: '${name}',
  metadata: { nestable: true },
}
`
}

rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })
const names = Object.keys(library.components).sort()
for (const name of names) writeFileSync(join(out, `${name}.figma.js`), template(name, library.components[name]))
console.log(`Code Connect: ${names.length} ficheros en figma/code-connect/.`)
