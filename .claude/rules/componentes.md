---
paths:
  - "src/components/**"
---

# Componentes

- Cada componente vive en `src/components/<Nombre>/` con cuatro ficheros: `<Nombre>.vue`,
  `<Nombre>.stories.ts`, `<Nombre>.contract.json` e `index.ts`. Se exporta desde `src/index.ts`.
- Para crear uno nuevo, sigue la skill `/nuevo-componente`: primero el contrato, después el código.
- El contrato se cambia en el mismo commit que el código. `npm run check` compara los dos.
- Un componente solo usa clases de tokens semánticos. Si necesitas un color, un radio o un
  tamaño que no existe, para y propón el token.
- Nombres: componente en PascalCase; props en camelCase; variantes por función (`danger`, no
  `red`); booleanos como adjetivo sin `is` (`selected`). La selección y el deshabilitado son
  estados, no variantes.
- Un componente es un fichero `.vue` con `<script setup lang="ts">`. Las props van en
  `defineProps`, los eventos en `defineEmits` y el contenido en el slot por defecto, declarado
  con `defineSlots`.
- Cada prop, cada evento y el slot llevan un comentario de una línea encima: es su documentación.
- El contrato usa nombres neutros: un evento `change` se anota como la prop función `onChange`
  y el slot por defecto como la prop `children`. `modelValue` (el `v-model`) no se anota.
- Los atributos del elemento nativo (`disabled`, `placeholder`, `@click`) no se declaran como
  props: llegan por los atributos. El tipo `<Nombre>Props` que se exporta suma las props
  propias y los atributos nativos.
- Cada variante y cada estado tienen su story. Los componentes interactivos tienen además una
  story `Interaccion` que usa el componente como lo haría una persona y comprueba el resultado.
- Antes de programar un comportamiento, usa el que ya da el navegador: `<dialog>`, `<input>`,
  `<button>`, `<nav>`.
- Zona pulsable de 44 px de alto como mínimo. Todo control tiene un nombre accesible.
- Si un componente usa otro del sistema, se importa y se declara en `composes`. No se copian estilos.
- Si cambian las props, hay que llevar el cambio a Figma: skill `/sincronizar-figma`.
