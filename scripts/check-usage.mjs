// Revisa todo el código de interfaz del repo con el mismo validador que usa el MCP.
// Componentes: ningún valor a mano ni clase fuera del sistema.
// Patrones y pantallas: además, solo piezas del sistema, con props y valores que existen.
// Uso: node scripts/check-usage.mjs [carpeta]   (con una carpeta, revisa esa app como "pantallas")
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { root } from './lib/tokens.mjs'
import { validate } from './lib/validate.mjs'

const data = JSON.parse(readFileSync(join(root, 'mcp', 'data.json'), 'utf8'))
const walk = (dir) =>
  !existsSync(dir)
    ? []
    : readdirSync(dir).flatMap((name) => {
        const path = join(dir, name)
        return statSync(path).isDirectory() ? (name === 'node_modules' ? [] : walk(path)) : /\.vue$/.test(name) && !/\.stories\./.test(name) ? [path] : []
      })

const external = process.argv[2]
const targets = external
  ? [[external, 'screen']]
  : [
      [join(root, 'src', 'components'), 'component'],
      [join(root, 'src', 'patterns'), 'screen'],
      [join(root, 'src', 'screens'), 'screen'],
    ]

const totals = { files: 0, error: 0, warning: 0, byRule: {} }
for (const [dir, level] of targets) {
  for (const file of walk(dir)) {
    totals.files++
    for (const issue of validate(readFileSync(file, 'utf8'), data, { level })) {
      totals[issue.severity]++
      totals.byRule[issue.rule] = (totals.byRule[issue.rule] ?? 0) + 1
      if (!external) console.log(`${issue.severity === 'error' ? '✗' : '!'} ${relative(root, file)}${issue.line ? `:${issue.line}` : ''} [${issue.rule}] ${issue.message}`)
    }
  }
}

if (external) {
  // Para medir una app que todavía no usa el sistema: solo el recuento.
  console.log(JSON.stringify(totals))
} else {
  console.log(`Uso: ${totals.files} ficheros, ${totals.error} error(es), ${totals.warning} aviso(s).`)
  if (totals.error) process.exit(1)
}
