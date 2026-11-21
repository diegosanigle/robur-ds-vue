<script setup lang="ts">
import { EmptyState } from 'robur-ds'

const emit = defineEmits<{ (e: 'log-session'): void }>()
</script>

<template>
  <EmptyState
    title="Aún no hay sesiones esta semana"
    description="Aquí verás tus sesiones. Registra una para empezar."
    action-label="Registrar sesión"
    @action="emit('log-session')"
  />
</template>
