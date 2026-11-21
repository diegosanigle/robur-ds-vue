<script setup lang="ts">
import { ref } from 'vue'
import { FormLayout, Input } from 'robur-ds'

const emit = defineEmits<{
  (e: 'save', exercise: { name: string; sets: number; reps: number }): void
  (e: 'cancel'): void
}>()

const name = ref('')
const sets = ref('')
const reps = ref('')
const submitting = ref(false)

const errors = ref<{ name?: string; sets?: string; reps?: string }>({})

function isPositiveInt(value: string) {
  return /^\d+$/.test(value.trim()) && Number(value) > 0
}

function onSubmit() {
  const next: typeof errors.value = {}
  if (!name.value.trim()) next.name = 'Escribe un nombre para el ejercicio'
  if (!isPositiveInt(sets.value)) next.sets = 'Escribe un número de series mayor que 0'
  if (!isPositiveInt(reps.value)) next.reps = 'Escribe un número de repeticiones mayor que 0'
  errors.value = next
  if (Object.keys(next).length) return

  submitting.value = true
  emit('save', {
    name: name.value.trim(),
    sets: Number(sets.value),
    reps: Number(reps.value),
  })
  submitting.value = false
}

function onCancel() {
  emit('cancel')
}
</script>

<template>
  <FormLayout
    title="Nuevo ejercicio"
    submit-label="Guardar ejercicio"
    cancel-label="Cancelar"
    :submitting="submitting"
    @submit="onSubmit"
    @cancel="onCancel"
  >
    <Input v-model="name" label="Nombre del ejercicio" :error="errors.name" />
    <Input v-model="sets" label="Series" numeric :error="errors.sets" />
    <Input v-model="reps" label="Repeticiones" numeric :error="errors.reps" />
  </FormLayout>
</template>
