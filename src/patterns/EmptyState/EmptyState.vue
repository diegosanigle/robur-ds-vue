<script setup lang="ts">
import { Button } from '../../components/Button'

export interface EmptyStateProps {
  /** Qué habrá aquí. En neutro: nunca como un fallo de la persona. */
  title: string
  /** Una frase que dice cómo empezar. */
  description: string
  /** Texto del botón. Si no se pasa, no hay acción. */
  actionLabel?: string
}

const { title, description, actionLabel } = defineProps<EmptyStateProps>()
const emit = defineEmits<{
  /** Se emite al pulsar el botón. */
  action: []
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-2 px-5 py-8 text-center">
    <h2 class="text-h3 text-primary">{{ title }}</h2>
    <p class="text-body text-secondary">{{ description }}</p>
    <div v-if="actionLabel" class="mt-4">
      <Button @click="emit('action')">{{ actionLabel }}</Button>
    </div>
  </div>
</template>
