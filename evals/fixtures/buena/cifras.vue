<script setup lang="ts">
import { StatCard } from 'robur-ds'

const props = defineProps<{ volume: number; max: number }>()
const nf = new Intl.NumberFormat('es-ES', { useGrouping: 'always' })
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-title text-primary">Temporada 2026</h2>
    <StatCard label="Volumen" :value="nf.format(props.volume)" unit="kg" />
    <StatCard label="Peso máximo" :value="props.max.toLocaleString('es-ES', { useGrouping: true, maximumFractionDigits: 1 })" unit="kg" />
    <p class="text-body text-secondary">Récord anterior: 2.480 kg</p>
  </div>
</template>
