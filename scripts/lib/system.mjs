// Lee el sistema entero (componentes, patrones y sus contratos) para los generadores:
// el catálogo, la documentación y, más adelante, el MCP.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'react-docgen'
import { root } from './tokens.mjs'

const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

function read(kind, folder, suffix) {
  const dir = join(root, 'src', folder)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((name) => existsSync(join(dir, name, `${name}.${suffix}.json`)))
    .sort()
    .map((name) => {
      const contract = JSON.parse(readFileSync(join(dir, name, `${name}.${suffix}.json`), 'utf8'))
      const code = readFileSync(join(dir, name, `${name}.tsx`), 'utf8')
      const stories = readFileSync(join(dir, name, `${name}.stories.tsx`), 'utf8')
      const title = /title: '([^']+)'/.exec(stories)[1]
      const doc = parse(code, { filename: `${name}.tsx` }).find((d) => d.displayName === name)
      return {
        ...contract,
        kind,
        // Las descripciones de las props viven en el código: aquí se juntan con el contrato.
        propDocs: Object.fromEntries(Object.entries(doc?.props ?? {}).map(([prop, d]) => [prop, d.description ?? ''])),
        stories: [...stories.matchAll(/^export const (\w+)/gm)].map((m) => ({
          name: m[1],
          id: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}--${kebab(m[1])}`,
        })),
      }
    })
}

export const components = read('component', 'components', 'contract')
export const patterns = read('pattern', 'patterns', 'pattern')
