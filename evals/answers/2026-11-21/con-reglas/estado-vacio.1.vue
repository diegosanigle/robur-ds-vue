<script setup lang="ts">
import { Button, EmptyState } from 'robur-ds'

const emit = defineEmits<{
  // Se pulsa «Registrar sesión»
  register: []
}>()
</script>

<template>
  <EmptyState
    title="Aún no hay sesiones esta semana"
    description="Aquí aparecerán las sesiones que registres. Empieza con la de hoy."
  >
    <Button variant="primary" @click="emit('register')">Registrar sesión</Button>
  </EmptyState>
</template>
