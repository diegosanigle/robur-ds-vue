// Se ejecuta DENTRO de Figma, con la herramienta use_figma del MCP de Figma.
// Devuelve la foto de la librería. El agente guarda el resultado en figma/library.json
// (campo "components") y después ejecuta `npm run check`.
const snapshot = {}
for (const node of figma.currentPage.children) {
  if (node.type !== 'COMPONENT_SET' && node.type !== 'COMPONENT') continue
  if (node.name.startsWith('.')) continue // piezas internas

  const properties = Object.entries(node.componentPropertyDefinitions).map(([key, d]) => ({
    name: key.split('#')[0],
    type: d.type,
    ...(d.variantOptions ? { values: d.variantOptions } : {}),
  }))
  const variants = node.type === 'COMPONENT_SET' ? node.children : [node]
  const layers = variants.flatMap((v) => [v, ...v.findAll(() => true)])

  snapshot[node.name] = {
    id: node.id,
    properties,
    // Instancias interiores cuyas propiedades se ven desde fuera.
    exposed: variants[0].findAllWithCriteria({ types: ['INSTANCE'] }).filter((i) => i.isExposedInstance).map((i) => i.name),
    variants: variants.length,
    // Rellenos con un color puesto a mano en lugar de una variable. Debe ser 0.
    unboundFills: layers.filter(
      (n) => n.type !== 'INSTANCE' && 'fills' in n && Array.isArray(n.fills) && n.fills.some((p) => p.type === 'SOLID' && !p.boundVariables?.color),
    ).length,
  }
}
return snapshot
