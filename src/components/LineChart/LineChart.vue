<script setup lang="ts">
import { computed } from 'vue'
import { Card } from '../Card'

export interface LineChartProps {
  /** Qué mide la gráfica, con su unidad. Es su título visible y su nombre. */
  title: string
  /** Un punto por registro, en orden: la etiqueta es la fecha y value la cifra. */
  data: { label: string; value: number }[]
  /** `surface` es la tarjeta normal; `inverse` es la destacada oscura, máximo una por pantalla. */
  variant?: 'surface' | 'inverse'
  /** Color de la línea: serie principal o segunda serie (solo en `inverse`). */
  series?: 'primary' | 'secondary'
}

const LINE = { primary: 'text-data-1', secondary: 'text-data-2' }
const DOT = { primary: 'bg-data-1', secondary: 'bg-data-2' }
const number = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 })

const { title, data, variant = 'surface', series = 'primary' } = defineProps<LineChartProps>()
const muted = computed(() => (variant === 'inverse' ? 'text-on-inverse-muted' : 'text-tertiary'))
const min = computed(() => Math.min(...data.map((d) => d.value)))
const max = computed(() => Math.max(...data.map((d) => d.value)))
const points = computed(() => {
  // Un margen del 10 % arriba y abajo para que los puntos no toquen el borde.
  const pad = (max.value - min.value || Math.abs(max.value) || 1) * 0.1
  const top = max.value + pad
  const bottom = min.value - pad
  return data.map((d, i) => ({
    key: d.label,
    x: data.length === 1 ? 50 : (i / (data.length - 1)) * 100,
    y: ((top - d.value) / (top - bottom)) * 100,
  }))
})
</script>

<template>
  <Card :variant="variant">
    <figure :aria-label="title" class="flex flex-col gap-3">
      <figcaption :class="['text-title', muted]">{{ title }}</figcaption>
      <div aria-hidden="true" class="flex h-40 gap-3">
        <div :class="['relative min-w-0 flex-1', LINE[series]]">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="absolute inset-0 size-full overflow-visible">
            <polyline
              :points="points.map((p) => `${p.x},${p.y}`).join(' ')"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
              vector-effect="non-scaling-stroke"
            />
          </svg>
          <span
            v-for="p in points"
            :key="p.key"
            :class="['absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-pill', DOT[series]]"
            :style="{ left: `${p.x}%`, top: `${p.y}%` }"
          />
        </div>
        <div v-if="data.length" :class="['flex flex-col justify-between text-right text-label tabular-nums', muted]">
          <span>{{ number.format(max) }}</span>
          <span>{{ number.format(min) }}</span>
        </div>
      </div>
      <div v-if="data.length" aria-hidden="true" :class="['flex justify-between text-label tabular-nums', muted]">
        <span>{{ data[0].label }}</span>
        <span v-if="data.length > 1">{{ data[data.length - 1].label }}</span>
      </div>
      <table class="sr-only">
        <tbody>
          <tr v-for="d in data" :key="d.label">
            <th scope="row">{{ d.label }}</th>
            <td>{{ number.format(d.value) }}</td>
          </tr>
        </tbody>
      </table>
    </figure>
  </Card>
</template>
