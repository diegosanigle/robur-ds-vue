<script setup lang="ts">
import { Chip } from 'robur-ds'

type TipoDia = 'empuje' | 'tiron' | 'pierna'

// Tipo de día elegido; null si aún no se ha elegido ninguno
const modelValue = defineModel<TipoDia | null>({ default: null })

const opciones: { value: TipoDia; label: string }[] = [
  { value: 'empuje', label: 'Empuje' },
  { value: 'tiron', label: 'Tirón' },
  { value: 'pierna', label: 'Pierna' },
]
</script>

<template>
  <fieldset class="flex flex-col gap-2">
    <legend class="text-label text-secondary">Tipo de día</legend>
    <div class="flex flex-wrap gap-2">
      <Chip
        v-for="opcion in opciones"
        :key="opcion.value"
        :selected="modelValue === opcion.value"
        @click="modelValue = opcion.value"
      >
        {{ opcion.label }}
      </Chip>
    </div>
  </fieldset>
</template>
