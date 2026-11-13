// Genera src/styles/tokens.css a partir de tokens/*.json.
// Uso: node scripts/build-tokens.mjs
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { cssVariable, primitiveVariable, primitives, reference, root, themes, typography } from './lib/tokens.mjs'

const rem = (px) => `${parseFloat(px) / 16}rem`
const lines = (entries) => entries.map(([k, v]) => `  ${k}: ${v};`).join('\n')

// 1. Los dos temas deben tener exactamente los mismos tokens.
const names = Object.keys(themes.light)
const missing = [
  ...names.filter((n) => !themes.dark[n]).map((n) => `${n} falta en el tema oscuro`),
  ...Object.keys(themes.dark).filter((n) => !themes.light[n]).map((n) => `${n} falta en el tema claro`),
]
if (missing.length) {
  console.error(`Los temas no coinciden:\n- ${missing.join('\n- ')}`)
  process.exit(1)
}

// 2. Primitivos de color: variables normales. No generan clases, así que un componente no puede usarlos.
const palette = Object.entries(primitives)
  .filter(([, t]) => t.type === 'color')
  .map(([name, t]) => [primitiveVariable(name), t.value.toLowerCase()])

// 3. Semánticos: variables de tema. Tailwind crea una clase por cada una.
const semantic = (theme) => names.map((n) => [cssVariable(n), `var(${primitiveVariable(reference(themes[theme][n], n))})`])
const light = semantic('light')
// En los bloques de tema solo van los tokens cuyo valor cambia entre temas.
const changes = (theme) => semantic(theme).filter(([, value], i) => value !== semantic(theme === 'dark' ? 'light' : 'dark')[i][1])

// 4. Medidas, sombras y tipografía.
const scale = [
  ['--spacing', rem(primitives['space.unit'].value)],
  ['--font-sans', primitives['font.sans'].value.map((f) => (f.includes(' ') ? `"${f}"` : f)).join(', ')],
  ...Object.entries(primitives).filter(([n]) => n.startsWith('radius.')).map(([n, t]) => [`--radius-${n.slice(7)}`, t.value]),
  ...Object.entries(primitives).filter(([n]) => n.startsWith('shadow.')).map(([n, t]) => [`--shadow-${n.slice(7)}`, t.value]),
]
const text = Object.entries(typography).flatMap(([name, t]) => {
  const v = `--text-${name.slice(5)}`
  return [
    [v, rem(t.value.fontSize)],
    [`${v}--line-height`, t.value.lineHeight],
    [`${v}--font-weight`, t.value.fontWeight],
    [`${v}--letter-spacing`, t.value.letterSpacing],
  ]
})

const css = `/* GENERADO por scripts/build-tokens.mjs a partir de tokens/*.json. No editar a mano. */

/* Primitivos: la paleta en bruto. */
:root {
${lines(palette)}
}

/* Semánticos (tema claro) y escalas. Solo de aquí salen clases de Tailwind. */
@theme static {
  --color-*: initial;
  --text-*: initial;
  --radius-*: initial;
  --shadow-*: initial;
  --font-*: initial;

${lines(light)}

${lines(scale)}

${lines(text)}
}

/* Tema oscuro: los mismos nombres, otros valores. Vale para la página entera o para una zona. */
[data-theme='dark'] {
${lines(changes('dark'))}
}

/* Permite una zona clara dentro de una página oscura. */
[data-theme='light'] {
${lines(changes('light'))}
}
`

writeFileSync(join(root, 'src', 'styles', 'tokens.css'), css)
console.log(`Tokens: ${palette.length} primitivos de color, ${names.length} semánticos × 2 temas, ${Object.keys(typography).length} estilos de texto`)
