<script lang="ts">
export const ICONS = {
  home: 'M4 11l8-7 8 7v9h-5v-6H9v6H4z',
  dumbbell: 'M6 8v8M3 10v4M18 8v8M21 10v4M6 12h12',
  'list-checks': 'M4 6l1.5 1.5L8 5M4 12l1.5 1.5L8 11M4 18l1.5 1.5L8 17M11 6h9M11 12h9M11 18h9',
  'line-chart': 'M4 4v16h16M8 15l4-5 3 3 4-6',
  settings: 'M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4',
  check: 'M5 12.5l4.5 4.5L19 7',
  'chevron-right': 'M9 6l6 6-6 6',
  'chevron-down': 'M6 9l6 6 6-6',
  plus: 'M12 5v14M5 12h14',
} as const
</script>

<script setup lang="ts">
export interface IconProps {
  /** Qué icono se dibuja. El juego es cerrado: si falta uno, se propone. */
  name: 'home' | 'dumbbell' | 'list-checks' | 'line-chart' | 'settings' | 'check' | 'chevron-right' | 'chevron-down' | 'plus'
  /** Tamaño: `sm` 16 px, `md` 20 px y `lg` 24 px. */
  size?: 'sm' | 'md' | 'lg'
  /** Nombre accesible. Sin él, el icono es decorativo y se oculta a los lectores de pantalla. */
  label?: string
}

const SIZES = { sm: 'size-4', md: 'size-5', lg: 'size-6' }

const { name, size = 'md', label } = defineProps<IconProps>()
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : true"
    :class="['shrink-0', SIZES[size]]"
  >
    <path :d="ICONS[name]" />
  </svg>
</template>
