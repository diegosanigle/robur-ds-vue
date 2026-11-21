<script setup lang="ts">
import { Icon } from 'robur-ds'
defineProps<{ open: boolean }>()
</script>

<template>
  <div v-if="open" role="status" class="fixed bottom-4 flex gap-2 rounded-lg bg-inverse text-on-inverse">
    <Icon name="check" />
    <p class="text-body">Sesión guardada</p>
  </div>
</template>
