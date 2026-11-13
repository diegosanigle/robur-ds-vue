// Genera docs/catalogo.md: el índice del sistema en una página.
// Es lo primero que lee un agente: qué hay y para qué sirve. El detalle está en cada contrato.
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { components, patterns } from './lib/system.mjs'
import { root, themes } from './lib/tokens.mjs'

const props = (c) =>
  c.props
    .filter((p) => p.type !== 'function')
    .map((p) => `\`${p.name}\`${p.type === 'enum' ? ` (${p.values.join(' · ')})` : ''}`)
    .join(', ')

const groups = {}
for (const name of Object.keys(themes.light)) {
  const [, group, ...rest] = name.split('.')
  ;(groups[group] ??= []).push(rest.join('-'))
}
const CLASS = { text: 'text-', bg: 'bg-', border: 'border-' }

const out = `<!-- GENERADO por scripts/build-catalog.mjs. No editar a mano. -->
# Catálogo de Robur DS

Todo lo que existe en el sistema. Si algo no está aquí, no existe: no lo inventes, proponlo.

## Patrones

Empieza por aquí: si un patrón resuelve la pantalla, úsalo antes de combinar componentes.

| Patrón | Qué resuelve | Detalle |
|---|---|---|
${patterns.map((p) => `| \`${p.name}\` | ${p.description} | \`src/patterns/${p.name}/${p.name}.pattern.json\` |`).join('\n')}

## Componentes

| Componente | Qué es | Props | Detalle |
|---|---|---|---|
${components.map((c) => `| \`${c.name}\` | ${c.description} | ${props(c)} | \`src/components/${c.name}/${c.name}.contract.json\` |`).join('\n')}

Antes de usar un componente, lee su contrato: \`useWhen\`, \`avoidWhen\` y \`rules\` dicen cuándo y cómo.

## Tokens

Clases de Tailwind disponibles. No existe ninguna otra clase de color, radio, sombra o tamaño de texto.

| Para | Clases |
|---|---|
${Object.entries(groups).map(([group, roles]) => `| ${{ text: 'Texto', bg: 'Fondos', border: 'Bordes', focus: 'Foco', heat: 'Heatmap', data: 'Datos' }[group]} | ${roles.map((r) => `\`${CLASS[group] ?? `*-${group}-`}${r}\``).join(' ')} |`).join('\n')}
| Estilos de texto | \`text-display\` \`text-h1\` \`text-h2\` \`text-h3\` \`text-title\` \`text-body\` \`text-sm\` \`text-control\` \`text-label\` |
| Radios | \`rounded-xs\` \`rounded-sm\` \`rounded-md\` \`rounded-lg\` \`rounded-xl\` \`rounded-pill\` |
| Sombras | \`shadow-sm\` \`shadow-md\` |

Qué texto puede ir sobre qué fondo: \`tokens/contrast.json\`.
`

writeFileSync(join(root, 'docs', 'catalogo.md'), out)
console.log(`Catálogo: ${patterns.length} patrones, ${components.length} componentes`)
