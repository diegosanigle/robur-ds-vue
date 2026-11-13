// Se ejecuta DENTRO de Figma (API de plugins), con la herramienta use_figma del MCP de Figma.
// Sustituye __TOKENS__ por la salida de `node scripts/figma-tokens.mjs`.
// Se puede ejecutar las veces que haga falta: actualiza lo que existe y crea lo que falta.
const TOKENS = __TOKENS__

const hex = (h) => ({
  r: parseInt(h.slice(1, 3), 16) / 255,
  g: parseInt(h.slice(3, 5), 16) / 255,
  b: parseInt(h.slice(5, 7), 16) / 255,
  a: h.length === 9 ? parseInt(h.slice(7, 9), 16) / 255 : 1,
})

const collections = await figma.variables.getLocalVariableCollectionsAsync()
const variables = await figma.variables.getLocalVariablesAsync()
const report = { created: 0, updated: 0, modes: {}, notes: [] }

function collection(name, firstMode) {
  let c = collections.find((x) => x.name === name)
  if (!c) {
    c = figma.variables.createVariableCollection(name)
    c.renameMode(c.modes[0].modeId, firstMode)
  }
  return c
}

function variable(name, c, type) {
  let v = variables.find((x) => x.name === name && x.variableCollectionId === c.id)
  if (v) report.updated++
  else {
    v = figma.variables.createVariable(name, c, type)
    report.created++
  }
  return v
}

// 1. Primitivos: una colección, un modo. Los colores quedan ocultos en los selectores (scopes vacíos).
const prim = collection('Primitives', 'Value')
const byName = {}
for (const t of TOKENS.primitives) {
  const v = variable(t.name, prim, t.type)
  v.setValueForMode(prim.modes[0].modeId, t.type === 'COLOR' ? hex(t.value) : t.value)
  v.scopes = t.scopes
  v.setVariableCodeSyntax('WEB', t.syntax)
  byName[t.name] = v
}

// 2. Semánticos: un modo por tema, si el plan de Figma lo permite.
const themes = Object.keys(TOKENS.semantic[0].modes)
const label = (theme) => theme[0].toUpperCase() + theme.slice(1)
const sem = collection('Semantic', label(themes[0]))
const modeIds = { [themes[0]]: sem.modes[0].modeId }
for (const theme of themes.slice(1)) {
  const existing = sem.modes.find((m) => m.name === label(theme))
  if (existing) modeIds[theme] = existing.modeId
  else {
    try {
      modeIds[theme] = sem.addMode(label(theme))
    } catch (error) {
      report.notes.push(`No se pudo crear el modo ${label(theme)}: ${error.message}`)
    }
  }
}
for (const t of TOKENS.semantic) {
  const v = variable(t.name, sem, 'COLOR')
  for (const [theme, modeId] of Object.entries(modeIds)) {
    v.setValueForMode(modeId, { type: 'VARIABLE_ALIAS', id: byName[t.modes[theme]].id })
  }
  v.scopes = t.scopes
  v.description = t.description
  v.setVariableCodeSyntax('WEB', t.syntax)
}
report.modes = Object.keys(modeIds)

// 3. Estilos de texto.
const WEIGHTS = { 400: 'Regular', 500: 'Medium', 600: 'Semi Bold', 700: 'Bold', 800: 'Extra Bold' }
const textStyles = await figma.getLocalTextStylesAsync()
for (const t of TOKENS.textStyles) {
  const fontName = { family: t.fontFamily, style: WEIGHTS[t.fontWeight] }
  await figma.loadFontAsync(fontName)
  let s = textStyles.find((x) => x.name === t.name)
  if (!s) {
    s = figma.createTextStyle()
    s.name = t.name
  }
  s.fontName = fontName
  s.fontSize = t.fontSize
  s.lineHeight = { unit: 'PERCENT', value: t.lineHeight }
  s.letterSpacing = { unit: 'PERCENT', value: t.letterSpacing }
  s.description = t.description
}

// 4. Sombras, como estilos de efecto.
const effectStyles = await figma.getLocalEffectStylesAsync()
for (const t of TOKENS.shadows) {
  let s = effectStyles.find((x) => x.name === t.name)
  if (!s) {
    s = figma.createEffectStyle()
    s.name = t.name
  }
  s.effects = [{ type: 'DROP_SHADOW', color: t.color, offset: { x: t.x, y: t.y }, radius: t.blur, spread: 0, visible: true, blendMode: 'NORMAL' }]
}

return {
  ...report,
  primitives: TOKENS.primitives.length,
  semantic: TOKENS.semantic.length,
  textStyles: TOKENS.textStyles.length,
  shadows: TOKENS.shadows.length,
  collectionIds: { primitives: prim.id, semantic: sem.id },
}
