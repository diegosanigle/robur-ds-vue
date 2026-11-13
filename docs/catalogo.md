<!-- GENERADO por scripts/build-catalog.mjs. No editar a mano. -->
# Catálogo de Robur DS

Todo lo que existe en el sistema. Si algo no está aquí, no existe: no lo inventes, proponlo.

## Patrones

Empieza por aquí: si un patrón resuelve la pantalla, úsalo antes de combinar componentes.

| Patrón | Qué resuelve | Detalle |
|---|---|---|
| `EmptyState` | Lo que se ve cuando una lista o una sección todavía no tiene contenido. | `src/patterns/EmptyState/EmptyState.pattern.json` |
| `FormLayout` | Un formulario corto: título, campos en columna y las acciones al final. | `src/patterns/FormLayout/FormLayout.pattern.json` |
| `SessionLog` | Registrar una sesión de entrenamiento: elegir el tipo de día, marcar los ejercicios y guardar. | `src/patterns/SessionLog/SessionLog.pattern.json` |

## Componentes

| Componente | Qué es | Props | Detalle |
|---|---|---|---|
| `BottomNav` | Navegación principal entre las secciones de la app. | `label`, `items`, `value` | `src/components/BottomNav/BottomNav.contract.json` |
| `Button` | Lanza una acción: guardar, cancelar, borrar. | `variant` (primary · secondary · danger), `fullWidth`, `loading`, `children` | `src/components/Button/Button.contract.json` |
| `Card` | Superficie que agrupa contenido relacionado. | `variant` (surface · inverse), `padding` (md · lg), `children` | `src/components/Card/Card.contract.json` |
| `Checkbox` | Casilla para marcar algo como hecho o activado. | `label`, `hint` | `src/components/Checkbox/Checkbox.contract.json` |
| `Chip` | Opción compacta que se puede seleccionar. | `variant` (default · accent), `selected`, `children` | `src/components/Chip/Chip.contract.json` |
| `ExerciseRow` | Fila de un ejercicio dentro de una sesión: se marca como hecho y se registran sus cifras. | `name`, `target`, `completed`, `children` | `src/components/ExerciseRow/ExerciseRow.contract.json` |
| `HeatmapCell` | Una semana del heatmap anual. Su color dice cuántas sesiones hubo. | `week`, `sessions`, `rest`, `current` | `src/components/HeatmapCell/HeatmapCell.contract.json` |
| `Input` | Campo de una línea para escribir texto o una cifra. | `label`, `hint`, `error`, `numeric` | `src/components/Input/Input.contract.json` |
| `Sheet` | Hoja modal anclada abajo para un detalle o una tarea corta. | `open`, `title`, `children` | `src/components/Sheet/Sheet.contract.json` |
| `StatCard` | Una cifra grande con la etiqueta que dice qué mide. | `label`, `value`, `unit`, `variant` (surface · inverse), `series` (primary · secondary) | `src/components/StatCard/StatCard.contract.json` |
| `Tabs` | Cambia entre vistas del mismo contenido dentro de una pantalla. | `label`, `tabs`, `value`, `children` | `src/components/Tabs/Tabs.contract.json` |

Antes de usar un componente, lee su contrato: `useWhen`, `avoidWhen` y `rules` dicen cuándo y cómo.

## Tokens

Clases de Tailwind disponibles. No existe ninguna otra clase de color, radio, sombra o tamaño de texto.

| Para | Clases |
|---|---|
| Texto | `text-primary` `text-secondary` `text-tertiary` `text-action` `text-on-action` `text-on-selected` `text-on-inverse` `text-on-inverse-muted` `text-danger` `text-success` `text-info` |
| Fondos | `bg-page` `bg-surface` `bg-inverse` `bg-action` `bg-action-soft` `bg-selected` `bg-danger-soft` `bg-success-soft` `bg-info-soft` `bg-overlay` |
| Bordes | `border-default` `border-control` `border-strong` `border-action` `border-danger` `border-inverse` |
| Foco | `*-focus-ring` |
| Heatmap | `*-heat-0` `*-heat-1` `*-heat-2` `*-heat-3` `*-heat-4` `*-heat-current` |
| Datos | `*-data-1` `*-data-2` |
| Estilos de texto | `text-display` `text-h1` `text-h2` `text-h3` `text-title` `text-body` `text-sm` `text-control` `text-label` |
| Radios | `rounded-xs` `rounded-sm` `rounded-md` `rounded-lg` `rounded-xl` `rounded-pill` |
| Sombras | `shadow-sm` `shadow-md` |

Qué texto puede ir sobre qué fondo: `tokens/contrast.json`.
