---
paths:
  - "src/patterns/**"
---

# Patrones

- Un patrón combina componentes para resolver una situación que se repite. No dibuja piezas
  nuevas: ni `<button>`, ni `<input>`, ni estilos de control propios.
- Vive en `src/patterns/<Nombre>/` con `<Nombre>.vue`, `<Nombre>.stories.ts`,
  `<Nombre>.pattern.json` e `index.ts`.
- El contrato del patrón declara en `components` los componentes que usa. `npm run check` lo compara
  con los imports.
- En un patrón solo se escriben clases de disposición (flex, grid, gap, padding), estilos de
  texto y colores de texto. Fondos, bordes y radios los ponen los componentes.
- Las reglas de un patrón hablan de orden, jerarquía y textos: cuál es la acción principal,
  cuántos toques hacen falta, qué se dice y qué no.
- Si una pantalla necesita algo que ningún patrón cubre y va a repetirse, propón un patrón nuevo.
