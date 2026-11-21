<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { BarChart, Button, Card, HeatmapYear, ScreenState, StatCard, Tabs } from 'robur-ds'

type Period = 'week' | 'month' | 'year'
type Status = 'loading' | 'error' | 'ready'

interface Summary {
  sessions: number
  minutes: number
  volumeKg: number
}
interface ProgressData {
  summary: Summary
  sessionsPerWeek: { label: string; value: number }[]
  year: number
  weeks: { week: number; sessions: number }[]
}

const emit = defineEmits<{ (e: 'register'): void }>()

const props = defineProps<{
  load: (period: Period) => Promise<ProgressData>
}>()

const tabs = [
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'year', label: 'Año' },
]

const period = ref<Period>('week')
const status = ref<Status>('loading')
const data = ref<ProgressData | null>(null)

const nf = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1, useGrouping: 'always' })
const fmt = (n: number) => nf.format(n)

const stats = computed(() => {
  const s = data.value?.summary
  return [
    { label: 'Sesiones', value: fmt(s?.sessions ?? 0) },
    { label: 'Minutos', value: fmt(s?.minutes ?? 0) },
    { label: 'Volumen total', value: fmt(s?.volumeKg ?? 0), unit: 'kg' },
  ]
})

async function fetchData() {
  status.value = 'loading'
  try {
    data.value = await props.load(period.value)
    status.value = 'ready'
  } catch {
    status.value = 'error'
  }
}

function onPeriodChange(value: string) {
  period.value = value as Period
  fetchData()
}

onMounted(fetchData)
</script>

<template>
  <main class="flex flex-col gap-6 bg-page p-5">
    <h1 class="text-h2 text-primary">Progreso</h1>

    <Tabs label="Periodo" :tabs="tabs" :value="period" @change="onPeriodChange" />

    <ScreenState v-if="status === 'loading'" state="loading" />
    <ScreenState
      v-else-if="status === 'error'"
      state="error"
      message="No han llegado tus datos de progreso. Revisa la conexión e inténtalo otra vez."
      @retry="fetchData"
    />

    <template v-else-if="data">
      <section aria-label="Resumen" class="grid grid-cols-1 gap-4">
        <StatCard
          v-for="stat in stats"
          :key="stat.label"
          :label="stat.label"
          :value="stat.value"
          :unit="stat.unit"
        />
      </section>

      <BarChart title="Sesiones por semana, últimas 12 semanas" :data="data.sessionsPerWeek" />

      <Card>
        <HeatmapYear :year="data.year" :weeks="data.weeks" />
      </Card>

      <Button fullWidth @click="emit('register')">Registrar sesión</Button>
    </template>
  </main>
</template>
