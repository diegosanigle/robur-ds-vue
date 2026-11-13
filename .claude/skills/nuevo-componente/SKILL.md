---
description: Crea un componente nuevo en Robur DS, o añade una variante o una prop a uno existente, empezando por el contrato. Úsala cuando pidan un componente, una variante, una prop o un estado nuevos.
---

# Nuevo componente

Trabaja en dos fases y **para entre una y otra**.

## Antes de empezar

1. Lee `docs/catalogo.md`. Si un componente existente resuelve la necesidad, dilo y no crees nada.
2. Si es una variante o una prop de un componente que ya existe, el procedimiento es el mismo
   sobre sus ficheros.

## Fase 1 — Contrato

1. Lee el contrato de un componente parecido como referencia de formato.
2. Escribe `src/components/<Nombre>/<Nombre>.contract.json` con todos los campos: `name`,
   `description`, `useWhen`, `avoidWhen` (cada frase dice qué usar en su lugar), `props`,
   `extends` si hereda de un elemento nativo, `states`, `tokens`, `composes`, `rules`,
   `accessibility` y `figma`. En `props`, los eventos se anotan como props función con el
   prefijo `on` y el slot por defecto como `children`.
3. Comprueba que los tokens que necesitas existen en `docs/catalogo.md`. Si falta alguno,
   propónlo aparte: nombre, primitivo en cada tema y parejas de contraste.
4. No inventes reglas de uso. Lo que no sepas, pregúntalo.
5. **Enseña el contrato y espera la aprobación.**

## Fase 2 — Código

1. `<Nombre>.vue`, con `<script setup lang="ts">`: props, eventos y slot con un comentario de
   una línea cada uno; solo clases de tokens.
2. `<Nombre>.stories.ts`: título `Componentes/<Nombre>`, `tags: ['autodocs']`, una story por
   variante y por estado, y una story `Interaccion` si el componente es interactivo.
3. `index.ts` y la exportación en `src/index.ts`.
4. Añade el componente a `src/foundations/Sampler.vue`, para que se pruebe en los dos temas.
5. Ejecuta `npm test` y `npm run build`. Si algo falla, explica la causa antes de arreglarlo.
   Si el arreglo cambia lo que el componente garantiza, actualiza el contrato.

## Al terminar

- Resume: ficheros creados, tokens añadidos y resultado de los tests.
- Recuerda que falta llevarlo a Figma con `/sincronizar-figma`. No lo hagas sin que te lo pidan.
