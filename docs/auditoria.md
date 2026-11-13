# Auditoría de Robur

Fecha: 2026-11-11 · Fuentes: `robur-design-system.md`, `tailwind.config.js`,
`src/index.css` y `src/components` del repo `project-robur`.

## 1. Inventario

### Color (23 valores)

| Grupo | Valores |
|---|---|
| Marca | `#FF3B00` primary · `#C43004` primary-ink · `#FFEDE7` primary-soft |
| Neutros cálidos | `#15110E` ink · `#3A322D` ink-2 · `#6B5F59` ink-3 · `#A39A94` ink-on-dark · `#FAF7F5` bg · `#FFFFFF` surface · `#E8E1DC` border · `#2E2723` border-dark |
| Heatmap | `#EAEAEA` · `#EEBFAF` · `#F49275` · `#F9673A` · `#FF3B00` |
| Datos | `#C6F24E` data-2 |
| Estados | éxito `#EDF7E8`/`#3D6B21` · error `#FDECEC`/`#B3261E` · info `#F0F0EF`/`#3A322D` |

### Tipografía

Inter (400–800) y ocho estilos: display 56 · h1 32 · h2 24 · h3 18,4 · title 16 ·
body 16 · sm 14 · label 12 en mayúsculas. Cifras siempre tabulares.

### Espaciado, radios, sombras

- Espaciado en múltiplos de 4: 4, 6 (label→input), 8, 16, 20, 24, 32.
- Radios: 4 (celda) · 12 · 16 · 24 · 28 · 999 (pill).
- Sombras: `sm` y `md`. Sistema casi plano.

### Componentes

| Componente | En la guía | En el código | Usos |
|---|---|---|---|
| Button | primary, icon, ghost, block-arrow | primary, ghost, danger | 11 |
| Input | sí | sí | 8 |
| Chip | sí | sí | 5 |
| Card | clara y oscura | sí | 5 |
| Sheet | sí | sí | 5 |
| Tabs | sí | sí | **0** |
| BottomNav, ExerciseRow, Heatmap | sí | sí, fuera de `ui/` | — |

## 2. Hallazgos

| # | Hallazgo | Evidencia | Gravedad |
|---|---|---|---|
| 1 | Los tokens están definidos dos veces | Los mismos hex en `tailwind.config.js` y en `:root` de `index.css` | Alta |
| 2 | Valores a mano en componentes | 16 hex en `.jsx` (heatmap, gráficas, `accent-[#FF3B00]`) y 12 valores arbitrarios distintos (`min-h-[44px]` ×5, `rounded-[4px]`…) | Alta |
| 3 | Se esquiva la librería | 11 `<button>` y 2 campos nativos escritos fuera de `components/ui` | Alta |
| 4 | La guía y el código no coinciden | La guía pide tipografía display «Special Gothic Expanded One»; el código usa Inter 800 y la fuente no se carga | Media |
| 5 | La guía se contradice | `--hm-0` es `#EAEAEA` en §2.3 y `#D6CCC3` en §9; §2.3 dice «celdas sin borde» y §9 «todas llevan borde» | Media |
| 6 | Variantes sin documentar o sin construir | `danger` existe en código y no en la guía; `btn-icon` y `btn-block-arrow` están en la guía y no en código | Media |
| 7 | Nombres distintos para lo mismo | «Secundario» en la guía, `ghost` en el código, `.btn-ghost` como clase | Baja |
| 8 | Componente sin uso | `Tabs` no se importa en ninguna vista | Baja |
| 9 | Accesibilidad sin comprobar en código | `Sheet` no tiene `role="dialog"`, ni foco atrapado, ni cierre con Escape; `Tabs` no tiene roles de pestaña | Alta |
| 10 | Un contraste de la guía es incorrecto | Blanco sobre `#FF3B00` es **3,57:1**, no 3,93:1, y un texto de 16 px en peso 600 **no** cuenta como texto grande. El botón primario no cumple AA | Alta |

## 3. Decisiones

1. **Una sola fuente de tokens.** Fichero de tokens → CSS generado. Nada de duplicados. (Bloque 2)
2. **Nombre único por concepto.** La variante se llama `secondary`; `ghost` desaparece.
3. **`danger` se queda** y se documenta. `btn-icon` y `btn-block-arrow` se posponen: no se usan.
4. **Tipografía display:** Inter 800, que es lo que hay en producción. La guía se corrige.
5. **`--hm-0` es `#EAEAEA`** y las celdas no llevan borde. Las menciones contrarias son restos de una versión anterior.
6. **`Tabs` entra en el sistema** aunque hoy no se use: está diseñado y documentado.
7. **El contraste del botón primario se resuelve en la lección 2.3**, con el cálculo delante.

## 4. Alcance de la v1

Button · Input · Chip · Card · Tabs · Sheet · Checkbox · StatCard · BottomNav ·
ExerciseRow · HeatmapCell. Patrones: registrar sesión, estado vacío, formulario.

## 5. Piezas pendientes

Situaciones que se resolvieron con una pieza existente. Si aparecen una segunda vez, toca proponer la pieza.

| Qué hacía falta | Dónde | Cómo se resolvió | Veces |
|---|---|---|---|
| Fila de una sesión en una lista | Pantalla de historial | Una `Card` por sesión con tres líneas de texto | 1 |
