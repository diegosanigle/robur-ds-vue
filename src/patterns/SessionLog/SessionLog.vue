<script setup lang="ts">
import { Button } from '../../components/Button'
import { Chip } from '../../components/Chip'
import { ExerciseRow } from '../../components/ExerciseRow'

export interface SessionLogProps {
  /** Los tipos de día entre los que elegir, en orden. */
  dayTypes: string[]
  /** El tipo de día elegido. */
  dayType: string
  /** Los ejercicios del día elegido. */
  exercises: { id: string; name: string; target?: string; completed: boolean }[]
  /** El guardado está en curso. */
  saving?: boolean
}

const { dayTypes, dayType, exercises, saving = false } = defineProps<SessionLogProps>()
const emit = defineEmits<{
  /** Se emite con el tipo de día pulsado. */
  dayTypeChange: [dayType: string]
  /** Se emite al marcar o desmarcar un ejercicio. */
  exerciseChange: [id: string, completed: boolean]
  /** Se emite al guardar la sesión. */
  save: []
}>()
</script>

<template>
  <section class="flex flex-col gap-6">
    <h2 class="text-h2 text-primary">Registrar sesión</h2>
    <div role="group" aria-label="Tipo de día" class="flex flex-wrap gap-2">
      <Chip v-for="type in dayTypes" :key="type" :selected="type === dayType" @click="emit('dayTypeChange', type)">{{ type }}</Chip>
    </div>
    <ul class="flex flex-col gap-4">
      <li v-for="exercise in exercises" :key="exercise.id">
        <ExerciseRow
          :name="exercise.name"
          :target="exercise.target"
          :completed="exercise.completed"
          @completed-change="emit('exerciseChange', exercise.id, $event)"
        />
      </li>
    </ul>
    <Button full-width :loading="saving" @click="emit('save')">Guardar sesión</Button>
  </section>
</template>
