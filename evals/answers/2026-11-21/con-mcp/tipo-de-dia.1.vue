<script setup lang="ts">
import { ref } from 'vue'
import { Chip } from 'robur-ds'

const dayTypes = ['Empuje', 'Tirón', 'Pierna']
const dayType = ref(dayTypes[0])
</script>

<template>
  <div role="group" aria-label="Tipo de día" class="flex flex-wrap gap-2">
    <Chip
      v-for="type in dayTypes"
      :key="type"
      :selected="dayType === type"
      @click="dayType = type"
    >
      {{ type }}
    </Chip>
  </div>
</template>
