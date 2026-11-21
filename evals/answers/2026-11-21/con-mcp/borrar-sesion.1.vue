<script setup lang="ts">
import { ref } from 'vue'
import { ConfirmSheet } from 'robur-ds'

const open = ref(true)
const loading = ref(false)

async function onConfirm() {
  loading.value = true
  try {
    // Aquí va la llamada que borra la sesión.
    open.value = false
  } finally {
    loading.value = false
  }
}

function onCancel() {
  open.value = false
}
</script>

<template>
  <ConfirmSheet
    :open="open"
    title="¿Borrar esta sesión?"
    description="Se perderán sus ejercicios y las cifras que registraste. No se puede recuperar."
    confirm-label="Borrar sesión"
    :loading="loading"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
</template>
