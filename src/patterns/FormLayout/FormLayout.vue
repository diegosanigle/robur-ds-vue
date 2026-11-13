<script setup lang="ts">
import { Button } from '../../components/Button'

export interface FormLayoutProps {
  /** Título del formulario. Dice qué se está creando o editando. */
  title: string
  /** Texto del botón principal: un verbo que dice qué pasa. */
  submitLabel: string
  /** Texto del botón para salir sin guardar. Si no se pasa, no hay botón. */
  cancelLabel?: string
  /** El envío está en curso: bloquea el botón principal. */
  submitting?: boolean
}

const { title, submitLabel, cancelLabel, submitting = false } = defineProps<FormLayoutProps>()
const emit = defineEmits<{
  /** Se emite al enviar el formulario, con el botón o con la tecla Intro. */
  submit: []
  /** Se emite al pulsar el botón de cancelar. */
  cancel: []
}>()
defineSlots<{
  /** Los campos, en el orden en que se rellenan. */
  default(): unknown
}>()
</script>

<template>
  <form novalidate class="flex flex-col gap-6" @submit.prevent="emit('submit')">
    <h2 class="text-h2 text-primary">{{ title }}</h2>
    <div class="flex flex-col gap-4"><slot /></div>
    <div class="flex flex-col gap-2">
      <Button type="submit" full-width :loading="submitting">{{ submitLabel }}</Button>
      <Button v-if="cancelLabel" variant="secondary" full-width @click="emit('cancel')">{{ cancelLabel }}</Button>
    </div>
  </form>
</template>
