---
description: Lleva a Figma los cambios de tokens o de componentes de Robur DS y comprueba la paridad. Úsala después de cambiar tokens/, un contrato o las props de un componente, o cuando pidan actualizar Figma.
---

# Sincronizar Figma

El código manda. Esta skill lleva a Figma lo que ya está en el repo; nunca trae cambios de Figma.

Archivo: https://www.figma.com/design/lTMwgNScwy7MEq8CaafRGC

**Límite del plan gratuito:** 20 lecturas al mes por MCP. Trabaja solo con la herramienta que
ejecuta código en el archivo: las capturas y los datos se devuelven desde ese mismo código.
Solo hay un modo de variables: Figma lleva el tema claro.

## 1. Antes de tocar Figma

Ejecuta `npm test`. Si no pasa, para: no se sincroniza un sistema roto.

## 2. Si cambiaron los tokens

1. Ejecuta `npm run figma:tokens` para obtener el JSON.
2. Ejecuta en el archivo el contenido de `scripts/figma/sync-variables.js`, sustituyendo
   `__TOKENS__` por ese JSON.
3. Enseña el resumen. `created` debe ser el número de tokens nuevos; el resto, `updated`.

## 3. Si cambiaron componentes

1. Lee el contrato del componente, incluido su campo `figma`.
2. Cambia el componente en Figma para que tenga exactamente esas propiedades y valores:
   `enum` y `boolean` son variantes; `string` es una propiedad de texto.
3. Todo color, radio y espaciado va enlazado a una variable; todo texto, a un estilo de texto.
4. Devuelve una captura del componente desde el mismo código y compárala con su story.

## 4. Foto y comprobación

1. Ejecuta en el archivo `scripts/figma/snapshot.js`.
2. Guarda el resultado en el campo `components` de `figma/library.json` y actualiza `date`.
3. Ejecuta `npm run check`. Si la paridad falla, corrige Figma, no el contrato.

## Al terminar

Resume qué cambió en Figma y pega la línea de paridad de `npm run check`.
