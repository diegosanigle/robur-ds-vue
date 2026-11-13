<script setup lang="ts">
// Página de prueba local. El escaparate real del sistema es Storybook.
import { Button, Input } from './index'
</script>

<template>
  <main class="mx-auto flex max-w-sm flex-col gap-4 p-5">
    <h1 class="text-h1">Robur DS</h1>
    <Input label="Peso (kg)" numeric placeholder="0" />
    <Button full-width>Guardar sesión</Button>
  </main>
</template>
