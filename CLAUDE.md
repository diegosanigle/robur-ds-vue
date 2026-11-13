# Robur DS (Vue)

Design System de Robur, una app personal de entrenamiento en casa, escrito en Vue 3.
Es el mismo sistema que `robur-ds-react`: los tokens, los contratos y la librería de Figma
se cambian allí y se copian aquí.

Robur registra, no juzga: no hay objetivos, metas ni avisos de fallo. Una semana a
cero es un dato, no un error.

## Dónde mirar, en este orden

1. `docs/catalogo.md` — todo lo que existe, en una página. Empieza siempre aquí.
2. El contrato de la pieza (`*.contract.json` o `*.pattern.json`) — cuándo se usa, cuándo no y sus reglas.
3. El código y las stories — solo si vas a cambiar la pieza.

## Comandos

- `npm run storybook` — Storybook en local (puerto 6007)
- `npm run check` — genera tokens y catálogo, y comprueba contraste, contratos, patrones y paridad con Figma
- `npm test` — `check` + tests de las stories (interacción y accesibilidad)
- `npm run build` — comprueba tipos y compila
- `npm run docs` — genera la web de documentación

## Reglas que valen siempre

- **Usa lo que hay.** Antes de escribir interfaz, busca en el catálogo un patrón; si no lo hay, componentes. Nunca un `<button>`, un `<input>` o un estilo propio para algo que ya existe.
- **Si falta algo, para y propónlo.** Un token, una variante o un componente nuevo se propone con su motivo; no se improvisa.
- **Ningún valor a mano.** Ni hex, ni primitivos, ni valores entre corchetes de Tailwind. Solo las clases del catálogo.
- **El código manda.** Un cambio empieza en `tokens/` o en un contrato, y de ahí va a Figma. Nunca al revés.
- **Lo generado no se edita:** `src/styles/tokens.css`, `docs/catalogo.md`, `figma/library.json` y `site/`.
- **Terminado es en verde.** Un cambio no está hecho hasta que pasan `npm test` y `npm run build`.
- Texto de la interfaz en español. Código y nombres de props en inglés.

Las reglas de cada zona del repo están en `.claude/rules/` y se cargan solas al tocar
esos ficheros. Los procedimientos largos son skills: `/nuevo-componente`,
`/nueva-pantalla` y `/sincronizar-figma`.

## Contexto

- `docs/arquitectura.md` — capas, nomenclatura y correspondencia entre código y Figma.
- `docs/accesibilidad.md` — qué se comprueba solo y qué hay que revisar a mano.
- `docs/auditoria.md` — qué había antes de este sistema y qué se decidió.
- Figma: https://www.figma.com/design/lTMwgNScwy7MEq8CaafRGC (solo tema claro: el plan gratuito admite un modo).
