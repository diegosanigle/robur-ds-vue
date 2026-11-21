<script setup lang="ts">
import { Select } from 'robur-ds'

type Exercise = {
  id: string
  name: string
}

const props = defineProps<{
  /** Ejercicios que la persona tiene guardados. */
  exercises: Exercise[]
  /** Mensaje de error que explica cómo arreglarlo. */
  error?: string
}>()

/** Id del ejercicio elegido; vacío si aún no hay ninguno. */
const selected = defineModel<string>({ default: '' })

const options = props.exercises.map((exercise) => ({
  value: exercise.id,
  label: exercise.name,
}))
</script>

<template>
  <Select
    v-model="selected"
    label="Ejercicio"
    placeholder="Elige un ejercicio"
    :options="options"
    :error="error"
  />
</template>
