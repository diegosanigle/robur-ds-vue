# Robur DS (Vue)

Design System agéntico de Robur, escrito en Vue 3. Es el mismo sistema que
[robur-ds-react](https://github.com/diegosanigle/robur-ds-react): mismos tokens, mismos
contratos y mismos componentes, construidos de forma nativa en Vue.

```bash
npm install
npm run storybook
```

Storybook: https://diegosanigle.github.io/robur-ds-vue/
Documentación: https://diegosanigle.github.io/robur-ds-vue/docs/

Figma: https://www.figma.com/design/lTMwgNScwy7MEq8CaafRGC (la misma librería que el resto de tecnologías)

Estado: tokens en dos temas, 11 componentes y 3 patrones con contrato, reglas y skills
para agentes, documentación generada, un MCP, evals y métricas, y comprobaciones de
contraste, contratos, patrones, paridad con Figma, uso y accesibilidad en `npm test`.

Los tokens (`tokens/`), los contratos (`*.contract.json` y `*.pattern.json`), `evals/cases.json` y `figma/library.json` no se editan aquí: se cambian en `robur-ds-react` y se copian.

## Usar el sistema desde otro proyecto

Añade el MCP a la configuración de tu agente (en Claude Code, un fichero `.mcp.json` en la raíz del proyecto):

```json
{
  "mcpServers": {
    "robur-ds": { "command": "npx", "args": ["-y", "github:diegosanigle/robur-ds-vue"] }
  }
}
```

El agente tendrá cinco herramientas: `get_catalog`, `get_component`, `get_tokens`, `get_text_on` y `validate_code`.

## Usar el sistema por URL

El mismo MCP está publicado en Vercel, sin instalar nada: `URL_PENDIENTE`.

En Claude Code:

```bash
claude mcp add --transport http robur-ds URL_PENDIENTE
```

O en `.mcp.json`:

```json
{
  "mcpServers": {
    "robur-ds": { "type": "http", "url": "URL_PENDIENTE" }
  }
}
```

Es público y tiene un límite de peticiones por IP. La función está en `api/mcp.mjs`: si el proyecto de Vercel tiene la variable `MCP_TOKEN`, exige la cabecera `Authorization: Bearer <token>`. `npm run mcp:remote` comprueba las dos formas sin desplegar.
