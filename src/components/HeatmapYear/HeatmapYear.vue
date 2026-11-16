<script setup lang="ts">
import { HeatmapCell } from '../HeatmapCell'

export interface HeatmapYearProps {
  /** Año ISO de las semanas. Da nombre a la rejilla. */
  year: number
  /** Una entrada por semana ISO del año, en orden: 52 o 53. */
  weeks: { week: number; sessions: number; level?: number; rest?: boolean; current?: boolean }[]
}

// Una clase por nivel, escrita entera: Tailwind solo genera las clases que encuentra en el código.
const LEGEND = ['bg-heat-0', 'bg-heat-1', 'bg-heat-2', 'bg-heat-3', 'bg-heat-4']

const { year, weeks } = defineProps<HeatmapYearProps>()
const emit = defineEmits<{
  /** Se emite con el número de semana al pulsar una celda. */
  weekSelect: [week: number]
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div role="group" :aria-label="`Semanas de ${year}`" class="grid grid-cols-13 gap-1">
      <HeatmapCell
        v-for="week in weeks"
        :key="week.week"
        :week="week.week"
        :sessions="week.sessions"
        :level="week.level"
        :rest="week.rest"
        :current="week.current"
        @click="emit('weekSelect', week.week)"
      />
    </div>
    <div aria-hidden="true" class="flex items-center justify-end gap-1.5 text-label text-tertiary">
      <span>menos</span>
      <span v-for="level in LEGEND" :key="level" :class="['size-2.5 rounded-xs', level]" />
      <span>más</span>
    </div>
  </div>
</template>
