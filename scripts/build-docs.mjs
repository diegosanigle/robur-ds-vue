// Genera la web de documentación en site/ a partir del código: contratos, comentarios de las
// props, tokens y stories. Ninguna página se escribe a mano.
// Uso: node scripts/build-docs.mjs
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { components, patterns } from './lib/system.mjs'
import { colorClasses, primitives, reference, resolve, root, themes, typography } from './lib/tokens.mjs'

const site = join(root, 'site')
// Los ejemplos en vivo son las stories publicadas: una sola fuente también para los ejemplos.
const STORYBOOK = process.env.STORYBOOK_URL ?? 'https://diegosanigle.github.io/robur-ds-vue'
// El texto de los contratos puede llevar etiquetas como <dialog>: se escapan para que no se interpreten.
const safe = (text) => String(text).replaceAll('<', '&lt;')
const esc = (text) => safe(text).replaceAll('|', '\\|')
const list = (items) => items.map((i) => `- ${safe(i)}`).join('\n')

function page(item) {
  const folder = item.kind === 'pattern' ? 'patterns' : 'components'
  const suffix = item.kind === 'pattern' ? 'pattern' : 'contract'
  const shown = item.stories.filter((s) => s.name !== 'Interaccion')
  const type = (p) => (p.type === 'enum' ? p.values.map((v) => `\`${v}\``).join(' · ') : p.type)
  // El contrato usa nombres neutros; la página los enseña como se escriben en Vue.
  const props = item.props.filter((p) => p.type !== 'function' && p.name !== 'children')
  const events = item.props.filter((p) => p.type === 'function').map((p) => ({ ...p, event: p.name[2].toLowerCase() + p.name.slice(3) }))
  const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
  const slot = item.props.find((p) => p.name === 'children')
  const figma = item.figma
    ? `## En Figma

Las mismas propiedades, con los mismos nombres y valores. Excepciones:

${
  [
    ...Object.entries(item.figma.props ?? {}).map(([name, rule]) =>
      typeof rule === 'string'
        ? `- \`${name}\` es ${rule === 'TEXT' ? 'una propiedad de texto' : 'un hueco (slot)'}.`
        : rule.omit
          ? `- \`${name}\` no existe en Figma. ${rule.omit}`
          : rule.via
            ? `- \`${name}\` es la propiedad \`${rule.via}\`.`
            : `- \`${name}\` tiene los valores ${rule.values.map((v) => `\`${v}\``).join(' · ')}.`,
    ),
    ...(item.figma.extra ?? []).map((e) => `- Figma añade \`${e.name}\`${e.values ? `: ${e.values.map((v) => `\`${v}\``).join(' · ')}` : ''}.`),
  ].join('\n') || 'Ninguna.'
}
`
    : ''

  return `<!-- GENERADO por scripts/build-docs.mjs. No editar a mano. -->
# ${item.name}

${safe(item.description)}

<iframe class="story" src="${STORYBOOK}/iframe.html?id=${shown[0].id}&viewMode=story" title="${item.name}: ${shown[0].name}" loading="lazy"></iframe>

Más ejemplos en Storybook: ${shown.map((s) => `[${s.name}](${STORYBOOK}/?path=/story/${s.id})`).join(' · ')}

## Cuándo usarlo

${list(item.useWhen)}

## Cuándo no

${list(item.avoidWhen)}

## Props

| Prop | Tipo | Por defecto | Para qué sirve |
|---|---|---|---|
${props.map((p) => `| \`${p.name}\`${p.required ? ' *' : ''} | ${type(p)} | ${p.default === undefined ? '—' : `\`${p.default}\``} | ${esc(item.propDocs[p.name] || '—')} |`).join('\n')}

\\* obligatoria${item.extends ? `. Acepta además todo lo que acepta un \`<${item.extends}>\` nativo${item.extends === 'input' ? ', y su valor se enlaza con `v-model`' : ''}.` : ''}
${events.length ? `\n## Eventos\n\n| Evento | Se escucha con | Cuándo se emite |\n|---|---|---|\n${events.map((e) => `| \`${e.event}\` | \`@${kebab(e.event)}\` | ${esc(item.propDocs[e.name] || '—')} |`).join('\n')}\n` : ''}${slot ? `\n## Slots\n\n| Slot | Obligatorio | Qué va dentro |\n|---|---|---|\n| por defecto | ${slot.required ? 'sí' : 'no'} | ${esc(item.propDocs.children || '—')} |\n` : ''}
## Reglas

${list(item.rules)}

## Accesibilidad

${list(item.accessibility)}
${item.states ? `\n## Estados\n\n${item.states.map((s) => `\`${s}\``).join(' · ')}\n` : ''}${
    item.tokens ? `\n## Tokens\n\n${item.tokens.map((t) => `\`${t}\``).join(' · ')}\n` : ''
  }${item.composes?.length || item.components?.length ? `\n## Usa\n\n${(item.composes ?? item.components).map((c) => `[${c}](/componentes/${c})`).join(' · ')}\n` : ''}
${figma}
## Código

\`src/${folder}/${item.name}/${item.name}.vue\` · contrato en \`${item.name}.${suffix}.json\`
`
}

const swatch = (hex) => `<span class="swatch" style="background:${hex}"></span>`
const tokensPage = `<!-- GENERADO por scripts/build-docs.mjs. No editar a mano. -->
# Tokens

Los valores viven en \`tokens/*.json\`. Los componentes solo usan los semánticos.

## Color

| Token | Clase | Claro | Oscuro | Uso |
|---|---|---|---|---|
${Object.keys(themes.light)
  .map((name) => {
    const cell = (theme) => `${swatch(resolve(theme, name))} \`${reference(themes[theme][name], name).replace('color.', '')}\``
    return `| \`${name}\` | \`${colorClasses(name)[0]}\` | ${cell('light')} | ${cell('dark')} | ${esc(themes.light[name].description ?? '')} |`
  })
  .join('\n')}

## Texto

| Clase | Tamaño | Peso | Interlineado | Uso |
|---|---|---|---|---|
${Object.entries(typography).map(([name, t]) => `| \`text-${name.slice(5)}\` | ${t.value.fontSize} | ${t.value.fontWeight} | ${t.value.lineHeight} | ${esc(t.description ?? '')} |`).join('\n')}

## Radios y sombras

| Clase | Valor |
|---|---|
${Object.entries(primitives).filter(([n]) => /^(radius|shadow)\./.test(n)).map(([n, t]) => `| \`${n.replace('radius.', 'rounded-').replace('shadow.', 'shadow-')}\` | \`${t.value}\` |`).join('\n')}

## Espaciado

Todo espaciado es un múltiplo de ${primitives['space.unit'].value}: \`p-4\` son ${parseFloat(primitives['space.unit'].value) * 4} px.

## Parejas de contraste

Qué va sobre qué, y el mínimo que debe cumplir. Se comprueba en cada \`npm test\`.

| Delante | Fondo | Mínimo |
|---|---|---|
${JSON.parse(readFileSync(join(root, 'tokens', 'contrast.json'), 'utf8')).pairs.map((p) => `| \`${p.fg}\` | \`${p.bg}\` | ${p.min}:1 |`).join('\n')}
`

const index = `<!-- GENERADO por scripts/build-docs.mjs. No editar a mano. -->
# Robur DS

El Design System de Robur. Esta web se genera desde el código: lo que lees aquí es lo que hay.

[Storybook](${STORYBOOK}/) · [Tokens](/tokens)

## Patrones

| Patrón | Qué resuelve |
|---|---|
${patterns.map((p) => `| [${p.name}](/patrones/${p.name}) | ${esc(p.description)} |`).join('\n')}

## Componentes

| Componente | Qué es |
|---|---|
${components.map((c) => `| [${c.name}](/componentes/${c.name}) | ${esc(c.description)} |`).join('\n')}
`

for (const folder of ['componentes', 'patrones']) {
  rmSync(join(site, folder), { recursive: true, force: true })
  mkdirSync(join(site, folder), { recursive: true })
}
for (const c of components) writeFileSync(join(site, 'componentes', `${c.name}.md`), page(c))
for (const p of patterns) writeFileSync(join(site, 'patrones', `${p.name}.md`), page(p))
writeFileSync(join(site, 'tokens.md'), tokensPage)
writeFileSync(join(site, 'index.md'), index)
writeFileSync(
  join(site, '.vitepress', 'sidebar.json'),
  JSON.stringify([
    { text: 'Fundamentos', items: [{ text: 'Tokens', link: '/tokens' }] },
    { text: 'Patrones', items: patterns.map((p) => ({ text: p.name, link: `/patrones/${p.name}` })) },
    { text: 'Componentes', items: components.map((c) => ({ text: c.name, link: `/componentes/${c.name}` })) },
  ]),
)
console.log(`Documentación: ${components.length + patterns.length + 2} páginas`)
