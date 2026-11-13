// Genera mcp/data.json: todo lo que el MCP sabe del sistema, en un solo fichero.
// El servidor solo lee este fichero, así que funciona fuera del repo, sin el código fuente.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { components, patterns } from './lib/system.mjs'
import { colorClasses, primitives, reference, resolve, root, themes, typography } from './lib/tokens.mjs'
import { contrast } from './check-contrast.mjs'

const SITE = 'https://diegosanigle.github.io/robur-ds-vue'
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

function example(piece) {
  // El ejemplo va en sintaxis de Vue: props enlazadas con «:» y eventos con «@».
  const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
  const attrs = piece.props
    .filter((p) => p.required && p.name !== 'children')
    .map((p) => (p.type === 'string' ? `${kebab(p.name)}="…"` : p.type === 'function' ? `@${kebab(p.name[2].toLowerCase() + p.name.slice(3))}="…"` : `:${kebab(p.name)}="…"`))
    .join(' ')
  const open = `<${piece.name}${attrs ? ` ${attrs}` : ''}`
  return `import { ${piece.name} } from '${pkg.name}'\n\n${piece.props.some((p) => p.name === 'children') ? `${open}>…</${piece.name}>` : `${open} />`}`
}

const piece = (p) => {
  const { propDocs, stories, kind, ...contract } = p
  return {
    ...contract,
    props: contract.props.map((prop) => ({ ...prop, description: propDocs[prop.name] || undefined })),
    example: example(p),
    docs: `${SITE}/docs/${kind === 'pattern' ? 'patrones' : 'componentes'}/${p.name}`,
    storybook: `${SITE}/?path=/story/${stories[0].id}`,
  }
}

const tokens = Object.keys(themes.light).map((name) => ({
  token: name,
  group: name.split('.')[1],
  classes: colorClasses(name),
  description: themes.light[name].description ?? '',
  light: reference(themes.light[name], name).replace('color.', ''),
  dark: reference(themes.dark[name], name).replace('color.', ''),
}))
const textStyles = Object.entries(typography).map(([name, t]) => ({ class: `text-${name.slice(5)}`, size: t.value.fontSize, weight: t.value.fontWeight, description: t.description ?? '' }))
const radii = Object.keys(primitives).filter((n) => n.startsWith('radius.')).map((n) => `rounded-${n.slice(7)}`)
const shadows = Object.keys(primitives).filter((n) => n.startsWith('shadow.')).map((n) => `shadow-${n.slice(7)}`)

const { pairs } = JSON.parse(readFileSync(join(root, 'tokens', 'contrast.json'), 'utf8'))
const round = (n) => Math.floor(n * 100) / 100
const bullets = (file, heading) => {
  const text = readFileSync(join(root, file), 'utf8')
  const section = heading ? text.slice(text.indexOf(heading)).split(/\n## /)[0] : text
  return [...section.matchAll(/^- (.+(?:\n  .+)*)/gm)].map((m) => m[1].replace(/\n\s+/g, ' '))
}

const data = {
  name: pkg.name,
  generated: 'scripts/build-mcp-data.mjs',
  components: Object.fromEntries(components.map((c) => [c.name, piece(c)])),
  patterns: Object.fromEntries(patterns.map((p) => [p.name, piece(p)])),
  tokens,
  textStyles,
  radii,
  shadows,
  // Todas las clases de diseño que existen. Cualquier otra es un error.
  classes: [...tokens.flatMap((t) => t.classes), ...textStyles.map((t) => t.class), ...radii, ...shadows],
  contrast: pairs.map((p) => ({ ...p, light: round(contrast(resolve('light', p.fg), resolve('light', p.bg))), dark: round(contrast(resolve('dark', p.fg), resolve('dark', p.bg))) })),
  rules: bullets('CLAUDE.md', '## Reglas que valen siempre'),
  writing: bullets('.claude/rules/textos.md'),
}

writeFileSync(join(root, 'mcp', 'data.json'), `${JSON.stringify(data, null, 1)}\n`)
console.log(`MCP: datos de ${components.length} componentes, ${patterns.length} patrones y ${tokens.length} tokens`)
