<script setup lang="ts">
import { ref } from 'vue'
import { FormLayout, Input } from 'robur-ds'

const emit = defineEmits<{
  (e: 'save', exercise: { name: string; sets: number; reps: number }): void
  (e: 'cancel'): void
}>()

defineProps<{ submitting?: boolean }>()

const name = ref('')
const sets = ref('')
const reps = ref('')
const errors = ref<{ name?: string; sets?: string; reps?: string }>({})

function isPositiveInt(value: string) {
  return /^\d+$/.test(value.trim()) && Number(value) > 0
}

function onSubmit() {
  errors.value = {
    name: name.value.trim() ? undefined : 'Escribe un nombre para el ejercicio',
    sets: isPositiveInt(sets.value) ? undefined : 'Escribe cuántas series, con un número mayor que 0',
    reps: isPositiveInt(reps.value) ? undefined : 'Escribe cuántas repeticiones, con un número mayor que 0',
  }
  if (errors.value.name || errors.value.sets || errors.value.reps) return
  emit('save', { name: name.value.trim(), sets: Number(sets.value), reps: Number(reps.value) })
}
</script>

<template>
  <FormLayout
    title="Nuevo ejercicio"
    submit-label="Guardar ejercicio"
    cancel-label="Cancelar"
    :submitting="submitting"
    @submit="onSubmit"
    @cancel="emit('cancel')"
  >
    <Input v-model="name" label="Nombre" :error="errors.name" />
    <Input v-model="sets" label="Series" numeric :error="errors.sets" />
    <Input v-model="reps" label="Repeticiones" numeric :error="errors.reps" />
  </FormLayout>
</template>
