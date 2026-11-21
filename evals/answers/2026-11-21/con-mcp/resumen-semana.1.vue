<script setup lang="ts">
import { StatCard } from 'robur-ds'

const sessions = '4'
const volume = '2.480'
const maxWeight = '62,5'
</script>

<template>
  <section class="grid grid-cols-2 gap-4">
    <div class="col-span-2">
      <StatCard variant="inverse" label="Sesiones" :value="sessions" />
    </div>
    <StatCard label="Volumen total" :value="volume" unit="kg" />
    <StatCard label="Peso máximo" :value="maxWeight" unit="kg" />
  </section>
</template>
