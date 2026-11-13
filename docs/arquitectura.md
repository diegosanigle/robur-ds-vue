# Arquitectura de Robur DS

## Capas

```
5. Capa agéntica   reglas · skills · MCP · evals        (Bloques 3 y 4)
4. Documentación   Storybook · web de docs              (Bloque 3)
3. Patrones        combinaciones de componentes         (Bloque 3)
2. Componentes     código Vue + contrato + story      (Bloques 1 y 2)
1. Tokens          primitivos → semánticos              (Bloque 2)
```

Cada capa solo usa la de debajo. Un componente no inventa un color: pide un token.
Un patrón no inventa un botón: usa el componente.

## Nomenclatura

| Qué | Regla | Ejemplo |
|---|---|---|
| Componente | PascalCase, sustantivo en inglés | `Button`, `StatCard` |
| Prop | camelCase en inglés | `fullWidth` |
| Variante | minúsculas, por función y no por aspecto | `primary`, `danger` (no `orange`) |
| Estado booleano | adjetivo sin `is` | `disabled`, `loading`, `selected` |
| Token | `categoría.rol.modificador` | `color.text.secondary` |
| Story | PascalCase; en español si describe un caso | `Primary`, `ConError` |

## Estructura de carpetas

```
tokens/                  primitivos, semánticos (claro y oscuro), tipografía y parejas de contraste
scripts/                 generador de tokens y comprobaciones
scripts/figma/           código que se ejecuta dentro de Figma
figma/library.json       foto de la librería de Figma, para comprobar la paridad
mcp/                     servidor MCP y sus datos (generados)
evals/                   casos, corredor y resultados de los evals
metrics/                 mediciones del sistema (generadas)
src/
  components/<Nombre>/   <Nombre>.vue · <Nombre>.stories.ts · <Nombre>.contract.json · index.ts
  screens/<Nombre>/      pantallas compuestas solo con piezas del sistema
  data/                  la página de métricas de Storybook
  patterns/<Nombre>/     <Nombre>.vue · <Nombre>.stories.ts · <Nombre>.pattern.json · index.ts
  foundations/           stories que pintan los tokens
  styles/tokens.css      GENERADO desde tokens/
  styles/index.css       estilos base
  index.ts               todo lo que el sistema exporta
docs/                    auditoría, arquitectura, accesibilidad y catálogo (generado)
site/                    web de documentación (generada con npm run docs)
.claude/rules/           reglas por zona del repo
.claude/skills/          procedimientos: nuevo componente, nueva pantalla, sincronizar Figma
.storybook/              configuración de Storybook
.github/workflows/       publicación automática
```

## Stack

Vite · Vue 3 · TypeScript · Tailwind CSS v4 · Storybook · Vitest.
Se usa TypeScript porque los tipos de las props son la base de la documentación
automática y de la paridad con Figma.

## Tokens y clases

Cada token semántico genera las clases de Tailwind con las que se usa:

| Token | Clase |
|---|---|
| `color.text.primary` | `text-primary` |
| `color.bg.surface` | `bg-surface` |
| `color.border.control` | `border-control` |
| `color.heat.2`, `color.data.1`, `color.focus.ring` | `bg-heat-2`, `text-data-1`, `ring-focus-ring` |
| `radius.md`, `shadow.sm` | `rounded-md`, `shadow-sm` |
| `text.h1` | `text-h1` (tamaño, peso, interlineado y tracking a la vez) |

Los primitivos (`color.orange.500`) no generan clases: un componente no puede usarlos.

## Código y Figma

| En el contrato | En Figma |
|---|---|
| Prop `enum` | Propiedad de variante con los mismos valores |
| Prop `boolean` | Propiedad de variante con `false` y `true` |
| Prop `string` | Propiedad de texto |
| Contenido (`node`) | Texto o hueco (*slot*), según diga el contrato |
| `function`, `array`, `number` | No existe, salvo que el contrato diga otra cosa |
| Estados (`disabled`, `focus`…) | Propiedad de variante `state` |
| Token semántico `color.bg.action` | Variable `color/bg/action`, colección Semantic |
| Token primitivo `color.orange.700` | Variable `color/orange/700`, colección Primitives, oculta en los selectores |
| Estilo de texto `text.h1` | Estilo de texto `text/h1` |

## Rutina de mantenimiento

| Cuándo | Qué |
|---|---|
| En cada cambio | `npm test` |
| Al cambiar tokens o componentes | `/sincronizar-figma`, que renueva la foto de Figma |
| Cada semana | `npm run metrics -- <carpeta de la app>` y subir el resultado. Mirar si la deuda de la app baja |
| Cada mes, o al cambiar contratos, reglas o descripciones del MCP | `npm run evals` y después `npm run metrics` |
| Cuando un agente se equivoca de una forma nueva | Un caso nuevo en `evals/cases.json` |
