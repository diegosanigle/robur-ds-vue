<script setup lang="ts">
import type { Component } from 'vue'

export interface BottomNavProps {
  /** Nombre de la navegación para lectores de pantalla. */
  label?: string
  /** Las secciones, en orden. Máximo cinco. */
  items: { value: string; label: string; href: string; icon: Component }[]
  /** Valor de la sección en la que está la persona. */
  value: string
}

const { label = 'Principal', items, value } = defineProps<BottomNavProps>()
</script>

<template>
  <nav :aria-label="label" class="flex justify-between bg-surface px-4 py-2 shadow-sm">
    <a
      v-for="item in items"
      :key="item.value"
      :href="item.href"
      :aria-current="item.value === value ? 'page' : undefined"
      :class="[
        'flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-md px-3 py-1.5',
        'text-label transition active:scale-95',
        item.value === value ? 'bg-page text-primary' : 'text-tertiary',
      ]"
    >
      <span aria-hidden="true" class="size-6"><component :is="item.icon" /></span>
      {{ item.label }}
    </a>
  </nav>
</template>
