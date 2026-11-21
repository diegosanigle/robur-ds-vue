<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  sessions: number
  totalVolumeKg: number
  maxWeightKg: number
}>()

const nf = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 })

const sessionsLabel = computed(() => (props.sessions === 1 ? 'sesión' : 'sesiones'))
const volume = computed(() => nf.format(props.totalVolumeKg))
const maxWeight = computed(() => nf.format(props.maxWeightKg))
</script>

<template>
  <section
    aria-label="Resumen de la semana"
    class="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
  >
    <h2 class="text-sm font-medium text-neutral-500">Resumen de la semana</h2>

    <dl class="mt-4 space-y-5">
      <!-- Dato principal -->
      <div>
        <dt class="text-sm font-medium text-neutral-600">Sesiones</dt>
        <dd class="mt-1 flex items-baseline gap-2">
          <span class="text-6xl font-bold leading-none tracking-tight text-neutral-900 tabular-nums">
            {{ sessions }}
          </span>
          <span class="text-base text-neutral-500">{{ sessionsLabel }}</span>
        </dd>
      </div>

      <!-- Datos secundarios -->
      <div class="grid grid-cols-2 gap-4 border-t border-neutral-100 pt-4">
        <div>
          <dt class="text-xs text-neutral-500">Volumen total</dt>
          <dd class="mt-1 text-xl font-semibold text-neutral-800 tabular-nums">
            {{ volume }} <span class="text-sm font-normal text-neutral-500">kg</span>
          </dd>
        </div>
        <div>
          <dt class="text-xs text-neutral-500">Peso máximo</dt>
          <dd class="mt-1 text-xl font-semibold text-neutral-800 tabular-nums">
            {{ maxWeight }} <span class="text-sm font-normal text-neutral-500">kg</span>
          </dd>
        </div>
      </div>
    </dl>
  </section>
</template>
