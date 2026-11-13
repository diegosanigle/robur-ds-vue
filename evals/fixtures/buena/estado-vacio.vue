<script setup lang="ts">
import { EmptyState } from 'robur-ds'

const emit = defineEmits<{ add: [] }>()
</script>

<template>
  <EmptyState
    title="Aún no hay sesiones esta semana"
    description="Cuando registres una, aparecerá aquí."
    action-label="Registrar sesión"
    @action="emit('add')"
  />
</template>
