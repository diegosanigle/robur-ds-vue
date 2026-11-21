<script setup lang="ts">
import { computed, ref } from 'vue'
import { Select } from 'robur-ds'

interface Exercise {
  id: string
  name: string
}

const props = defineProps<{ exercises: Exercise[] }>()

const selected = ref('')
const options = computed(() =>
  props.exercises.map((e) => ({ value: e.id, label: e.name }))
)
</script>

<template>
  <Select
    v-model="selected"
    label="Ejercicio de la sesión"
    placeholder="Elige un ejercicio"
    :options="options"
  />
</template>
