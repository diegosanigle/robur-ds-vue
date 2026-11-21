<script setup lang="ts">
import { computed } from 'vue'
import { StatCard } from 'robur-ds'

const props = withDefaults(
  defineProps<{
    sessions?: number
    volume?: number
    maxWeight?: number
  }>(),
  { sessions: 0, volume: 0, maxWeight: 0 },
)

const nf = new Intl.NumberFormat('es-ES', { useGrouping: 'always', maximumFractionDigits: 1 })

const sessionsText = computed(() => nf.format(props.sessions))
const volumeText = computed(() => nf.format(props.volume))
const maxWeightText = computed(() => nf.format(props.maxWeight))
</script>

<template>
  <section aria-labelledby="week-summary-title" class="flex flex-col gap-4">
    <h2 id="week-summary-title" class="text-title text-primary">Resumen de la semana</h2>
    <StatCard variant="inverse" label="Sesiones" :value="sessionsText" />
    <div class="grid grid-cols-2 gap-4">
      <StatCard label="Volumen total" :value="volumeText" unit="kg" />
      <StatCard label="Peso máximo" :value="maxWeightText" unit="kg" />
    </div>
  </section>
</template>
