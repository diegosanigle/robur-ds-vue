<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonHTMLAttributes } from 'vue'

interface Props {
  /** Número de semana ISO, del 1 al 53. */
  week: number
  /** Sesiones registradas esa semana. Decide el nivel de color. */
  sessions: number
  /** Semana marcada como descanso: se distingue por el borde discontinuo, no por un color. */
  rest?: boolean
  /** Es la semana en curso. */
  current?: boolean
}

// Todo lo que acepta un <button> nativo (disabled, @click…) llega por los atributos, no como props.
export type HeatmapCellProps = Props & ButtonHTMLAttributes

// Una clase por nivel, escrita entera: Tailwind solo genera las clases que encuentra en el código.
const LEVELS = ['bg-heat-0', 'bg-heat-1', 'bg-heat-2', 'bg-heat-3', 'bg-heat-4']

const { week, sessions, rest = false, current = false } = defineProps<Props>()
const detail = computed(() => (rest ? 'descanso' : `${sessions} ${sessions === 1 ? 'sesión' : 'sesiones'}`))
</script>

<template>
  <button
    type="button"
    :aria-label="`Semana ${week}, ${detail}${current ? ', semana actual' : ''}`"
    :class="[
      'aspect-square min-h-3.5 rounded-xs transition-transform active:scale-95',
      rest ? 'border border-dashed border-control bg-surface' : LEVELS[Math.min(Math.max(sessions, 0), 4)],
      current ? 'outline-2 outline-offset-2 outline-heat-current' : '',
    ]"
  />
</template>
