<script setup lang="ts">
import { LineChart } from 'robur-ds'

const registros = [
  { label: '07/09', value: 80 },
  { label: '14/09', value: 80 },
  { label: '21/09', value: 82.5 },
  { label: '28/09', value: 82.5 },
  { label: '05/10', value: 85 },
  { label: '12/10', value: 85 },
  { label: '19/10', value: 87.5 },
  { label: '26/10', value: 85 },
  { label: '02/11', value: 87.5 },
  { label: '09/11', value: 90 },
  { label: '16/11', value: 90 },
  { label: '23/11', value: 92.5 },
]
</script>

<template>
  <main class="p-4">
    <LineChart
      title="Press banca, peso máximo (kg)"
      :data="registros"
      variant="inverse"
    />
  </main>
</template>
