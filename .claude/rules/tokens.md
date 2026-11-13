---
paths:
  - "tokens/**"
  - "src/styles/**"
  - "scripts/build-tokens.mjs"
---

# Tokens

- Los valores viven en `tokens/*.json`, en formato DTCG. `src/styles/tokens.css` se genera con
  `npm run tokens`: no se edita a mano.
- Dos niveles. Los primitivos (`color.orange.500`) son la paleta. Los semánticos
  (`color.bg.action`) son usos, y siempre apuntan a un primitivo con `{color.orange.700}`:
  nunca llevan un hex.
- `semantic.light.json` y `semantic.dark.json` tienen exactamente los mismos tokens.
- Nombres de semánticos: `color.<grupo>.<rol>`, con grupo `text`, `bg`, `border` o uno propio
  del producto. El rol dice para qué sirve, no cómo se ve.
- Todo fondo que lleva texto tiene su pareja: `bg.action` y `text.on-action`.
- Un par de colores nuevo que se use junto se añade a `tokens/contrast.json` con su mínimo:
  4.5 para texto, 3 para texto grande, bordes de controles y foco.
- No cambies un color de marca para que pase un test. Presenta opciones con el contraste de
  cada una y espera la decisión.
- Antes de añadir un token, comprueba que ninguno existente sirve. Un token por componente
  (`button-bg`) es señal de que falta un rol compartido.
- Después de cambiar tokens: `npm test`, y después la skill `/sincronizar-figma`.
