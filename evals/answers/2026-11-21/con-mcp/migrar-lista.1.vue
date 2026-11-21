<script setup lang="ts">
import { Button, ListRow, StatCard } from 'robur-ds'

interface Exercise {
  id: string | number
  name: string
  sets: number
}

const props = defineProps<{
  exercises: Exercise[]
  totalVolume: number
}>()

const emit = defineEmits<{
  (e: 'edit', exercise: Exercise): void
}>()

const numberFormat = new Intl.NumberFormat('es-ES', { useGrouping: 'always' })

function formatNumber(value: number): string {
  return numberFormat.format(value)
}

function setsLabel(sets: number): string {
  return `${sets} ${sets === 1 ? 'serie' : 'series'}`
}
</script>

<template>
  <section>
    <ul>
      <ListRow
        v-for="exercise in props.exercises"
        :key="exercise.id"
        :title="exercise.name"
        :detail="setsLabel(exercise.sets)"
      >
        <Button variant="text" @click="emit('edit', exercise)">Editar</Button>
      </ListRow>
    </ul>
    <StatCard label="Volumen total" :value="formatNumber(props.totalVolume)" unit="kg" />
  </section>
</template>
