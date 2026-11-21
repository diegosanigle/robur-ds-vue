<script setup lang="ts">
import { EmptyState } from 'robur-ds'

const emit = defineEmits<{ (e: 'register'): void }>()
</script>

<template>
  <EmptyState
    title="Aún no hay sesiones esta semana"
    description="Aquí verás tus sesiones de esta semana. Registra una para empezar."
    action-label="Registrar sesión"
    @action="emit('register')"
  />
</template>
