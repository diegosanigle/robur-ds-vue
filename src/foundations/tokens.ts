// Lee los ficheros de tokens para pintarlos en Storybook. La documentación sale del mismo sitio que el CSS.
import primitives from '../../tokens/primitives.json'
import dark from '../../tokens/semantic.dark.json'
import light from '../../tokens/semantic.light.json'
import typography from '../../tokens/typography.json'

type Node = { [key: string]: unknown }
export type Token = { name: string; value: unknown; description?: string }

function flatten(node: Node, path: string[] = [], out: Token[] = []): Token[] {
  if ('$value' in node) {
    out.push({ name: path.join('.'), value: node.$value, description: node.$description as string | undefined })
    return out
  }
  for (const [key, child] of Object.entries(node)) {
    if (!key.startsWith('$')) flatten(child as Node, [...path, key], out)
  }
  return out
}

const flat = (file: Node) => flatten(file)
const reference = (value: unknown) => String(value).slice(1, -1)

export const primitiveTokens = flat(primitives)
export const textStyles = flat(typography)
const darkTokens = flat(dark)

/** Semánticos con su primitivo en cada tema. */
export const semanticTokens = flat(light).map((token) => ({
  name: token.name,
  description: token.description,
  light: reference(token.value),
  dark: reference(darkTokens.find((d) => d.name === token.name)?.value),
}))

/** 'color.text.primary' → 'var(--text-color-primary)'. La misma regla que scripts/lib/tokens.mjs. */
export function cssVar(name: string) {
  const [, group, ...rest] = name.split('.')
  const prefix = { text: '--text-color', bg: '--background-color', border: '--border-color' }[group] ?? `--color-${group}`
  return `var(${prefix}-${rest.join('-')})`
}

export const primitiveVar = (name: string) => `var(--${name.replace(/^color\./, '').replaceAll('.', '-')})`
