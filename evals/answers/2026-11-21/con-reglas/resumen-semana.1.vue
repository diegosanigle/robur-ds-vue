<script setup lang="ts">
import { StatCard } from 'robur-ds'

defineProps<{
  /** Sesiones registradas esta semana */
  sessions: number
  /** Volumen total de la semana, en kg */
  volume: number
  /** Peso máximo levantado esta semana, en kg */
  maxWeight: number
}>()

const format = (n: number) =>
  n.toLocaleString('es-ES', { useGrouping: 'always', maximumFractionDigits: 1 })
</script>

<template>
  <section class="flex flex-col gap-4" aria-labelledby="week-summary-title">
    <h2 id="week-summary-title" class="text-h2 text-primary">Resumen de la semana</h2>

    <StatCard variant="inverse" label="Sesiones" :value="format(sessions)" />

    <div class="grid grid-cols-2 gap-4">
      <StatCard label="Volumen total" :value="format(volume)" unit="kg" />
      <StatCard label="Peso máximo" :value="format(maxWeight)" unit="kg" />
    </div>
  </section>
</template>
