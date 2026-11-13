// Revisa un trozo de interfaz (una plantilla o un componente de Vue) contra el sistema. No ejecuta el código: lo lee.
// Lo usan el MCP (validate_code), la comprobación de uso (check-usage) y los evals.
// `data` es el contenido de mcp/data.json.

const RAW = { button: 'Button', input: 'Input o Checkbox', select: 'Chip o Tabs', textarea: 'Input', dialog: 'Sheet' }
const DESIGN = /^(bg|text|border|rounded|shadow|ring|outline|fill|stroke)-(.+)$/
// Clases que empiezan igual que las de diseño pero son de disposición o de forma, no de aspecto.
const NEUTRAL = {
  text: /^(left|center|right|justify|wrap|nowrap|balance|pretty|ellipsis|clip)$/,
  bg: /^(transparent|current|inherit|none)$/,
  border: /^(\d+|[trblxyse](-\d+)?|dashed|dotted|solid|none|collapse|separate|transparent|current)$/,
  rounded: /^$/,
  shadow: /^none$/,
  ring: /^(\d+|inset|offset-\d+)$/,
  outline: /^(\d+|none|hidden|dashed|dotted|offset-\d+)$/,
  fill: /^(none|current)$/,
  stroke: /^(none|current|\d+)$/,
}
// Etiquetas de Vue que no son piezas del sistema.
const BUILT_IN = ['Teleport', 'Transition', 'TransitionGroup', 'KeepAlive', 'Suspense', 'Component', 'RouterLink', 'RouterView']
const camel = (name) => name.replace(/-(\w)/g, (_, letter) => letter.toUpperCase())
const pascal = (name) => camel(name).replace(/^\w/, (letter) => letter.toUpperCase())
const BLAME = /\b(objetivos?|metas?|fallaste|fallado|fracas\w+|no has (entrenado|cumplido|hecho)|deberías|te falta[n]?)\b|¡/i

export function validate(code, data, { level = 'screen' } = {}) {
  const issues = []
  const add = (rule, severity, message, index) =>
    issues.push({ rule, severity, message, line: index === undefined ? undefined : code.slice(0, index).split('\n').length })
  const pieces = { ...data.components, ...data.patterns }

  // 1. Valores a mano.
  for (const m of code.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) add('no-hex', 'error', `Color a mano ${m[0]}: usa una clase de token (get_tokens).`, m.index)
  for (const m of code.matchAll(/(?<![\w-])[a-z][\w:-]*-\[[^\]]+\]/g)) add('no-arbitrary', 'error', `Valor arbitrario "${m[0]}": usa una clase de la escala o propón un token.`, m.index)
  if (level !== 'component') {
    for (const m of code.matchAll(/(?<![\w-])(?::|v-bind:)?style=["']/g)) add('no-inline-style', 'error', 'Estilo en línea: usa clases de tokens.', m.index)
  }

  // 2. Clases de diseño que no existen en el sistema.
  for (const literal of code.matchAll(/(['"`])((?:(?!\1)[^\\\n]|\\.)*)\1/g)) {
    for (const word of literal[2].split(/\s+/)) {
      const cls = word.split(':').pop().split('/')[0]
      const match = DESIGN.exec(cls)
      if (!match || !/^[a-z0-9-]+$/.test(cls)) continue
      const [, prefix, rest] = match
      const side = prefix === 'rounded' ? rest.replace(/^[trblse]{1,2}-/, '') : rest
      if (data.classes.includes(`${prefix}-${side}`) || data.classes.includes(cls) || NEUTRAL[prefix].test(rest)) continue
      add('unknown-class', 'error', `La clase "${cls}" no existe en el sistema. Consulta get_tokens.`, literal.index)
    }
  }
  if (level === 'component') return issues

  // De un componente .vue, lo que sigue solo mira la plantilla: en el script, `ref<Tipo>()` parece una etiqueta.
  const start = code.indexOf('<template')
  const template = start === -1 ? code : code.slice(start, code.lastIndexOf('</template>') === -1 ? undefined : code.lastIndexOf('</template>'))
  const at = (index) => (start === -1 ? index : index + start)

  // 3. Controles dibujados a mano.
  for (const m of template.matchAll(/<(button|input|select|textarea|dialog)[\s>/]/g)) {
    add('no-raw-control', 'error', `<${m[1]}> dibujado a mano: usa ${RAW[m[1]]}.`, at(m.index))
  }

  // 4. Piezas, props y eventos que no existen.
  const local = new Set([...code.matchAll(/import\s+([A-Z]\w*)\s+from\s+['"]\.{1,2}\/[^'"]*\.vue['"]/g)].map((m) => m[1]))
  for (const m of template.matchAll(/<([A-Z]\w*|[a-z]+(?:-[a-z]+)+)((?:\s+[:@#]?[\w.:-]+(?:=(?:"[^"]*"|'[^']*'))?)*)\s*\/?>/g)) {
    // En Vue una pieza se puede escribir <StatCard> o <stat-card>.
    const name = pascal(m[1])
    const piece = pieces[name]
    if (!piece) {
      if (/^[A-Z]/.test(m[1]) && !local.has(name) && !BUILT_IN.includes(name)) add('unknown-component', 'error', `<${name}> no existe en el sistema. Mira get_catalog; si falta, proponlo.`, at(m.index))
      continue
    }
    const given = new Set()
    let spread = false
    for (const attr of m[2].matchAll(/\s([:@#]?[\w.:-]+)(?:=(?:"([^"]*)"|'([^']*)'))?/g)) {
      const raw = attr[1]
      const text = attr[2] ?? attr[3]
      if (raw === 'v-bind') spread = true // v-bind="objeto": las props no se ven
      if (raw.startsWith('#') || (raw.startsWith('v-') && !/^v-(bind|on):/.test(raw))) continue // slots y directivas
      const event = /^(@|v-on:)/.test(raw)
      const bound = /^(:|v-bind:)/.test(raw)
      const bare = camel(raw.replace(/^(@|:|v-on:|v-bind:)/, '').split('.')[0])
      // Un evento `change` es, en el contrato, la prop función `onChange`.
      const propName = event ? `on${pascal(bare)}` : bare
      given.add(propName)
      const prop = piece.props.find((p) => p.name === propName)
      // Un valor enlazado solo se puede comprobar si es un texto literal: :variant="'danger'".
      const value = bound ? /^'([^']*)'$/.exec(text ?? '')?.[1] : event ? undefined : text
      if (!prop) {
        if (piece.extends || ['key', 'ref'].includes(bare)) continue
        if (event) add('unknown-prop', 'error', `${name} no emite el evento "${bare}". Eventos: ${piece.props.filter((p) => p.type === 'function').map((p) => camel(p.name[2].toLowerCase() + p.name.slice(3))).join(', ') || 'ninguno'}.`, at(m.index))
        else add('unknown-prop', 'error', `${name} no tiene la prop "${bare}". Props: ${piece.props.filter((p) => p.type !== 'function' && p.name !== 'children').map((p) => p.name).join(', ')}.`, at(m.index))
      } else if (prop.type === 'enum' && value !== undefined && !prop.values.includes(value)) {
        add('invalid-value', 'error', `${name}: ${bare}="${value}" no existe. Valores: ${prop.values.join(', ')}.`, at(m.index))
      }
    }
    for (const prop of piece.props.filter((p) => p.required && p.name !== 'children')) {
      if (given.has(prop.name) || spread) continue
      const label = prop.type === 'function' ? `el evento obligatorio "${prop.name[2].toLowerCase() + prop.name.slice(3)}"` : `la prop obligatoria "${prop.name}"`
      add('missing-prop', 'error', `A ${name} le falta ${label}.`, at(m.index))
    }
  }

  // 5. Reglas de composición que se pueden contar.
  const tags = (name) => [...template.matchAll(new RegExp(`<${name}\\b([^>]*)>`, 'g'))].map((m) => m[1])
  const primaries = tags('Button').filter((a) => !/variant=/.test(a) || /variant=["']primary/.test(a)).length
  if (primaries > 1) add('one-primary', 'warning', `Hay ${primaries} botones primary. La regla es uno por pantalla.`)
  const inverse = [...tags('Card'), ...tags('StatCard')].filter((a) => /variant=["']inverse/.test(a)).length
  if (inverse > 1) add('one-inverse', 'warning', `Hay ${inverse} tarjetas inverse. La regla es como mucho una por pantalla.`)

  // 6. Textos: Robur registra, no juzga.
  for (const m of template.matchAll(/>([^<>{}]+)</g)) {
    const found = BLAME.exec(m[1])
    if (found) add('neutral-copy', 'warning', `Texto "${m[1].trim()}": "${found[0]}" suena a meta, a fallo o a exclamación. Robur registra, no juzga.`, at(m.index))
  }
  for (const m of template.matchAll(/(?<![:\w-])(?:title|description|label|hint|error|action-label|actionLabel|submit-label|submitLabel)="([^"]+)"/g)) {
    const found = BLAME.exec(m[1])
    if (found) add('neutral-copy', 'warning', `Texto "${m[1]}": "${found[0]}" suena a meta, a fallo o a exclamación. Robur registra, no juzga.`, at(m.index))
  }
  return issues
}

export const format = (issues) =>
  issues.length
    ? issues.map((i) => `${i.severity === 'error' ? '✗' : '!'} [${i.rule}]${i.line ? ` línea ${i.line}:` : ''} ${i.message}`).join('\n')
    : '✓ Sin problemas: el código usa solo piezas y clases del sistema.'
