<script setup lang="ts">
import { computed } from 'vue'
import { LineChart } from 'robur-ds'

// Un registro del peso máximo en press banca
interface Registro {
  // Etiqueta del registro, por ejemplo la fecha
  label: string
  // Peso máximo de ese registro, en kg
  value: number
}

const props = defineProps<{
  // Registros del peso máximo, del más antiguo al más reciente
  registros: Registro[]
}>()

// Solo los últimos 12 registros
const ultimos = computed(() => props.registros.slice(-12))
</script>

<template>
  <LineChart
    title="Peso máximo en press banca (kg)"
    :data="ultimos"
    variant="surface"
    series="primary"
  />
</template>
