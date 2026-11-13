// Mide el sistema y guarda la medición: metrics/latest.json y una fila por día en metrics/history.json.
// Uso: node scripts/metrics.mjs [carpeta de la app]   (o la variable ROBUR_APP)
// Con la carpeta de la app mide además cuánta interfaz suya sigue fuera del sistema.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { components, patterns } from './lib/system.mjs'
import { primitives, root, themes, typography } from './lib/tokens.mjs'

const read = (path) => (existsSync(join(root, path)) ? JSON.parse(readFileSync(join(root, path), 'utf8')) : null)
const data = read('mcp/data.json')
const library = read('figma/library.json')
const evals = read('evals/results/latest.json')
const previous = read('metrics/latest.json')
const today = new Date().toISOString().slice(0, 10)
const percent = (part, total) => (total ? Math.round((part / total) * 100) : 0)
const pieces = [...components, ...patterns]
const stories = pieces.reduce((sum, p) => sum + p.stories.length, 0)
const props = pieces.flatMap((p) => p.props.filter((prop) => prop.name !== 'children').map((prop) => p.propDocs[prop.name]))

// Margen de contraste: la pareja que pasa más justa. Si baja, alguien está apurando.
const tightest = data.contrast
  .flatMap((p) => ['light', 'dark'].map((theme) => ({ pair: `${p.fg.replace('color.', '')} sobre ${p.bg.replace('color.', '')}`, theme, margin: Math.round((p[theme] / p.min) * 100) / 100 })))
  .sort((a, b) => a.margin - b.margin)[0]

const metrics = {
  date: today,
  system: {
    components: components.length,
    patterns: patterns.length,
    semanticTokens: Object.keys(themes.light).length,
    primitiveColors: Object.values(primitives).filter((t) => t.type === 'color').length,
    textStyles: Object.keys(typography).length,
    themes: Object.keys(themes).length,
    stories,
  },
  coverage: {
    contracts: percent(pieces.length, pieces.length), // npm run check lo exige: si no fuera 100, no habría medición
    documentedProps: percent(props.filter(Boolean).length, props.length),
    figmaParity: percent(components.filter((c) => library.components[c.name]).length, components.length),
    figmaSnapshotAgeDays: Math.round((Date.parse(today) - Date.parse(library.date)) / 86_400_000),
  },
  accessibility: {
    contrastPairs: data.contrast.length * Object.keys(themes).length,
    tightestPair: tightest,
  },
  evals: evals
    ? { date: evals.date, model: evals.model, ...Object.fromEntries(Object.entries(evals.conditions).map(([name, r]) => [name, { passed: r.passed, total: r.total, rate: r.rate }])) }
    : null,
  // Si no se pasa la carpeta de la app, se conserva la última medición.
  app: previous?.app ?? null,
}

const appDir = process.argv[2] ?? process.env.ROBUR_APP
if (appDir) {
  const usage = JSON.parse(execFileSync('node', [join(root, 'scripts', 'check-usage.mjs'), appDir], { encoding: 'utf8' }))
  // grep termina con error cuando no encuentra nada: en ese caso son cero ficheros.
  let code = 0
  try {
    code = execFileSync('grep', ['-rlE', `from ['"]${data.name}['"]`, appDir, '--include=*.vue', '--include=*.ts'], { encoding: 'utf8' }).split('\n').filter(Boolean).length
  } catch {
    code = 0
  }
  metrics.app = {
    date: today,
    files: usage.files,
    filesUsingSystem: code,
    rawControls: usage.byRule['no-raw-control'] ?? 0,
    hexColors: usage.byRule['no-hex'] ?? 0,
    arbitraryValues: usage.byRule['no-arbitrary'] ?? 0,
    classesOutsideSystem: usage.byRule['unknown-class'] ?? 0,
  }
}

writeFileSync(join(root, 'metrics', 'latest.json'), `${JSON.stringify(metrics, null, 2)}\n`)
const history = (read('metrics/history.json') ?? []).filter((row) => row.date !== today)
history.push({
  date: today,
  components: metrics.system.components,
  patterns: metrics.system.patterns,
  stories,
  figmaParity: metrics.coverage.figmaParity,
  evalsWithMcp: metrics.evals?.['con-mcp']?.rate ?? null,
  appRawControls: metrics.app?.rawControls ?? null,
  appClassesOutsideSystem: metrics.app?.classesOutsideSystem ?? null,
})
writeFileSync(join(root, 'metrics', 'history.json'), `${JSON.stringify(history, null, 2)}\n`)
console.log(`Métricas del ${today}: ${pieces.length} piezas, ${stories} stories, paridad ${metrics.coverage.figmaParity} %, evals ${metrics.evals ? `${metrics.evals['con-mcp']?.rate} % con MCP` : 'sin ejecutar'}${metrics.app ? `, app con ${metrics.app.rawControls} controles a mano` : ''}`)
