<script setup lang="ts">
import { Button, ListRow, StatCard } from 'robur-ds'

type Exercise = {
  id: string
  name: string
  series: number
}

defineProps<{
  /** Ejercicios de la sesión, en el orden en que se muestran. */
  exercises: Exercise[]
  /** Volumen total de la sesión, en kg. */
  totalVolume: number
}>()

const emit = defineEmits<{
  /** Se pulsa Editar en un ejercicio; lleva el ejercicio. */
  edit: [exercise: Exercise]
}>()

const formatVolume = (value: number) =>
  new Intl.NumberFormat('es-ES', { useGrouping: 'always' }).format(value)
</script>

<template>
  <div class="flex flex-col gap-4">
    <ul>
      <li v-for="exercise in exercises" :key="exercise.id">
        <ListRow :title="exercise.name" :detail="`${exercise.series} series`">
          <Button
            variant="text"
            :aria-label="`Editar ${exercise.name}`"
            @click="emit('edit', exercise)"
          >
            Editar
          </Button>
        </ListRow>
      </li>
    </ul>

    <StatCard label="Volumen total" :value="formatVolume(totalVolume)" unit="kg" />
  </div>
</template>
