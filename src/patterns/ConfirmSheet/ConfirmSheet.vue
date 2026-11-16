<script setup lang="ts">
import { Button } from '../../components/Button'
import { Sheet } from '../../components/Sheet'

export interface ConfirmSheetProps {
  /** La hoja está abierta. */
  open: boolean
  /** Qué se va a hacer, como pregunta: «¿Borrar esta sesión?». */
  title: string
  /** Una frase con lo que se pierde. */
  description: string
  /** Texto del botón que confirma: el verbo de la acción («Borrar sesión»). */
  confirmLabel: string
  /** La confirmación está en curso: bloquea los botones. */
  loading?: boolean
}

const { open, title, description, confirmLabel, loading = false } = defineProps<ConfirmSheetProps>()
const emit = defineEmits<{
  /** Se emite al confirmar. */
  confirm: []
  /** Se emite al cancelar o al cerrar la hoja. */
  cancel: []
}>()
</script>

<template>
  <Sheet :open="open" :title="title" @close="emit('cancel')">
    <p class="text-body text-secondary">{{ description }}</p>
    <div class="mt-6 flex flex-col gap-3">
      <Button variant="danger" full-width :loading="loading" @click="emit('confirm')">{{ confirmLabel }}</Button>
      <Button variant="secondary" full-width :disabled="loading" @click="emit('cancel')">Cancelar</Button>
    </div>
  </Sheet>
</template>
