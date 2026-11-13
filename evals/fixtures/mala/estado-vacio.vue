<script setup lang="ts">
const emit = defineEmits<{ add: [] }>()
</script>

<template>
  <div class="flex flex-col items-center rounded-2xl bg-gray-50 p-8 text-center">
    <span class="text-4xl">😴</span>
    <h2 class="mt-4 text-lg font-semibold text-gray-900">¡Todavía no has entrenado esta semana!</h2>
    <p class="mt-1 text-sm text-gray-500">Te faltan 3 sesiones para cumplir tu objetivo.</p>
    <button class="mt-6 rounded-full bg-[#FF3B00] px-6 py-3 text-white" @click="emit('add')">Empezar ahora</button>
  </div>
</template>
