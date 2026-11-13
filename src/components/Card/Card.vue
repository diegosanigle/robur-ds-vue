<script setup lang="ts">
export interface CardProps {
  /** `surface` es la tarjeta normal; `inverse` es la destacada oscura, máximo una por pantalla. */
  variant?: 'surface' | 'inverse'
  /** Espacio interior: `md` son 20 px y `lg` son 24 px, para la tarjeta destacada. */
  padding?: 'md' | 'lg'
}

const VARIANTS = {
  surface: 'bg-surface text-primary',
  inverse: 'bg-inverse text-on-inverse',
}

const PADDINGS = { md: 'p-5', lg: 'p-6' }

const { variant = 'surface', padding = 'md' } = defineProps<CardProps>()
defineSlots<{
  /** El contenido de la tarjeta. */
  default(): unknown
}>()
</script>

<template>
  <div :class="['rounded-lg', PADDINGS[padding], VARIANTS[variant]]"><slot /></div>
</template>
