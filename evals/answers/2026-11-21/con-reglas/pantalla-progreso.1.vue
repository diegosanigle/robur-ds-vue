<script setup lang="ts">
import { computed } from 'vue'
import {
  BarChart,
  Button,
  HeatmapYear,
  ScreenState,
  StatCard,
  Tabs,
} from 'robur-ds'

type Period = 'week' | 'month' | 'year'

const props = defineProps<{
  /** Estado de la carga de datos */
  status: 'loading' | 'error' | 'ready'
  /** Periodo que se está viendo */
  period: Period
  /** Cifras de resumen del periodo */
  summary: { sessions: number; minutes: number; volumeKg: number }
  /** Sesiones por semana para la gráfica */
  weeklySessions: { label: string; value: number }[]
  /** Año del heatmap */
  year: number
  /** Semanas ISO del año con sus sesiones */
  weeks: InstanceType<typeof HeatmapYear>['$props']['weeks']
}>()

const emit = defineEmits<{
  /** Cambia el periodo que se ve */
  'update:period': [value: Period]
  /** Pide volver a cargar los datos */
  retry: []
  /** Pide registrar una sesión */
  register: []
}>()

const periods = [
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'year', label: 'Año' },
]

const fmt = new Intl.NumberFormat('es-ES', {
  useGrouping: 'always',
  maximumFractionDigits: 1,
})

const sessions = computed(() => fmt.format(props.summary.sessions))
const minutes = computed(() => fmt.format(props.summary.minutes))
const volume = computed(() => fmt.format(props.summary.volumeKg))
</script>

<template>
  <main class="flex flex-col gap-6 p-4">
    <h1 class="text-h1 text-primary">Progreso</h1>

    <ScreenState
      v-if="status !== 'ready'"
      :state="status"
      @retry="emit('retry')"
    />

    <template v-else>
      <Tabs
        label="Periodo"
        :tabs="periods"
        :value="period"
        @change="(v: Period) => emit('update:period', v)"
      />

      <section class="grid grid-cols-3 gap-3" aria-label="Resumen">
        <StatCard label="Sesiones" :value="sessions" />
        <StatCard label="Minutos" :value="minutes" />
        <StatCard label="Volumen total" :value="volume" unit="kg" />
      </section>

      <BarChart title="Sesiones por semana" :data="weeklySessions" />

      <HeatmapYear :year="year" :weeks="weeks" />

      <Button variant="primary" full-width @click="emit('register')">
        Registrar sesión
      </Button>
    </template>
  </main>
</template>
