// Lectura de los tokens. Lo comparten el generador de CSS y las comprobaciones.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const root = join(import.meta.dirname, '..', '..')
const read = (name) => JSON.parse(readFileSync(join(root, 'tokens', name), 'utf8'))

/** Aplana un fichero de tokens: { 'color.orange.500': { value, type, description } }. */
export function flatten(node, path = [], type, out = {}) {
  const ownType = node.$type ?? type
  if ('$value' in node) {
    out[path.join('.')] = { value: node.$value, type: ownType, description: node.$description }
    return out
  }
  for (const [key, child] of Object.entries(node)) {
    if (!key.startsWith('$')) flatten(child, [...path, key], ownType, out)
  }
  return out
}

export const primitives = flatten(read('primitives.json'))
export const typography = flatten(read('typography.json'))
export const themes = {
  light: flatten(read('semantic.light.json')),
  dark: flatten(read('semantic.dark.json')),
}

/** '{color.orange.500}' → 'color.orange.500'. Un semántico solo puede apuntar a un primitivo. */
export function reference(token, name) {
  const match = /^\{(.+)\}$/.exec(token.value)
  if (!match) throw new Error(`${name}: un token semántico debe apuntar a un primitivo, no llevar un valor directo`)
  if (!primitives[match[1]]) throw new Error(`${name}: el primitivo ${match[1]} no existe`)
  return match[1]
}

/** Valor final (hex) de un token semántico en un tema. */
export const resolve = (theme, name) => primitives[reference(themes[theme][name], name)].value

// Tailwind crea las clases a partir del nombre de la variable:
// --text-color-primary → text-primary, --background-color-surface → bg-surface.
const NAMESPACES = { text: '--text-color', bg: '--background-color', border: '--border-color' }
const PREFIXES = { text: ['text'], bg: ['bg'], border: ['border'] }
const ANY_COLOR = ['bg', 'text', 'border', 'outline', 'ring', 'fill', 'stroke']

/** 'color.text.primary' → '--text-color-primary'; 'color.heat.2' → '--color-heat-2'. */
export function cssVariable(name) {
  const [, group, ...rest] = name.split('.')
  return NAMESPACES[group] ? `${NAMESPACES[group]}-${rest.join('-')}` : `--color-${group}-${rest.join('-')}`
}

/** Clases de Tailwind con las que se usa un token de color. */
export function colorClasses(name) {
  const [, group, ...rest] = name.split('.')
  return PREFIXES[group]
    ? PREFIXES[group].map((p) => `${p}-${rest.join('-')}`)
    : ANY_COLOR.map((p) => `${p}-${group}-${rest.join('-')}`)
}

export const primitiveVariable = (name) => `--${name.split('.').slice(name.startsWith('color.') ? 1 : 0).join('-')}`
