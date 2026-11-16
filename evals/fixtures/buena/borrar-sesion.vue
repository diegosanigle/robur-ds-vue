<script setup lang="ts">
import { ref } from 'vue'
import { ConfirmSheet } from 'robur-ds'

const props = defineProps<{
  open: boolean
  onDelete: () => Promise<void> | void
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()

const loading = ref(false)

async function confirmDelete() {
  loading.value = true
  try {
    await props.onDelete()
    emit('deleted')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <ConfirmSheet
    :open="open"
    title="¿Borrar esta sesión?"
    description="Se perderán sus ejercicios y las cifras registradas. No se puede recuperar."
    confirm-label="Borrar sesión"
    :loading="loading"
    @confirm="confirmDelete"
    @cancel="emit('cancel')"
  />
</template>
