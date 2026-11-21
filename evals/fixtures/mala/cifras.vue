<script setup lang="ts">
import { StatCard } from 'robur-ds'

const props = defineProps<{ volume: number; max: number; sessions: number }>()
const nf = new Intl.NumberFormat('es-ES')
const decimal = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 })
</script>

<template>
  <div class="flex flex-col gap-4">
    <StatCard label="Volumen" :value="nf.format(props.volume)" unit="kg" />
    <StatCard label="Peso máximo" :value="(62.5).toFixed(1)" unit="kg" />
    <StatCard label="Sesiones" :value="props.sessions.toLocaleString()" />
    <StatCard label="Media" :value="decimal.format(props.max)" unit="kg" />
    <p class="text-body text-secondary">Récord anterior: 2480 kg</p>
  </div>
</template>
