---
description: Compone una pantalla o una sección de interfaz con las piezas de Robur DS. Úsala cuando pidan una pantalla, una vista, un flujo, un formulario o cualquier interfaz nueva para Robur.
---

# Nueva pantalla

Una pantalla se compone; no se dibuja. Todo lo que aparece en ella sale del catálogo.

## 1. Entiende qué se pide

Antes de elegir piezas, escribe en dos líneas: qué quiere conseguir la persona en esta
pantalla y cuál es la acción principal. Si no está claro, pregúntalo.

## 2. Elige las piezas

1. Lee `docs/catalogo.md`.
2. Busca primero un **patrón** que resuelva la pantalla o una parte.
3. Para el resto, elige componentes. De cada uno, lee su contrato: `useWhen`, `avoidWhen` y `rules`.
4. Enseña la lista antes de escribir código: qué pieza usas para qué, y qué regla de su
   contrato te afecta.

## 3. Si falta algo

No lo improvises. Di qué falta y propón una de tres salidas, en este orden de preferencia:
una pieza existente usada de otra forma, una variante nueva o un componente nuevo
(`/nuevo-componente`). Espera la decisión.

## 4. Compón

- Solo componentes y patrones del sistema. Ningún `<button>`, `<input>` ni control propio.
- Solo clases de disposición, estilos de texto y colores de texto del catálogo.
- Un solo botón `primary` y como mucho una tarjeta `inverse` por pantalla.
- Contenedor de 480 px de ancho máximo; 20 px de margen lateral; 16 px entre tarjetas.
- Textos según `.claude/rules/textos.md`.

## 5. Comprueba

1. Crea una story de la pantalla en `Pantallas/<Nombre>` para que pase los tests de accesibilidad.
2. Ejecuta `npm test` y `npm run build`.
3. Repasa: ¿cuántos toques hacen falta para la acción principal? Registrar una sesión no pasa de tres.

## Al terminar

Enumera las piezas usadas y cualquier regla de contrato que hayas tenido que interpretar.
