<script setup lang="ts">
import { Checkbox } from '../Checkbox'

export interface ExerciseRowProps {
  /** Nombre del ejercicio. */
  name: string
  /** Objetivo del ejercicio, ya formateado: «3 series × 12 reps». */
  target?: string
  /** El ejercicio está hecho. */
  completed: boolean
}

const { name, target, completed } = defineProps<ExerciseRowProps>()
const emit = defineEmits<{
  /** Se emite con el nuevo estado al marcar o desmarcar. */
  completedChange: [completed: boolean]
}>()
defineSlots<{
  /** Los campos de registro: series, repeticiones, peso. Máximo tres. */
  default?(): unknown
}>()
</script>

<template>
  <div :class="['flex flex-col gap-3 rounded-md border border-default p-3.5', completed ? 'bg-action-soft' : 'bg-surface']">
    <Checkbox :label="name" :hint="target" :model-value="completed" @update:model-value="emit('completedChange', $event ?? false)" />
    <div v-if="$slots.default" class="grid grid-cols-3 gap-2"><slot /></div>
  </div>
</template>
