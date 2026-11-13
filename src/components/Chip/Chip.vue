<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue'

interface Props {
  /** `default` para elegir entre opciones; `accent` para destacar una sin seleccionarla. */
  variant?: 'default' | 'accent'
  /** La opción está elegida. */
  selected?: boolean
}

// Todo lo que acepta un <button> nativo (disabled, @click…) llega por los atributos, no como props.
export type ChipProps = Props & ButtonHTMLAttributes

const VARIANTS = {
  default: 'border-default bg-surface text-tertiary',
  accent: 'border-transparent bg-action-soft text-action',
}

const { variant = 'default', selected = false } = defineProps<Props>()
defineSlots<{
  /** El texto del chip. */
  default(): unknown
}>()
</script>

<template>
  <button
    type="button"
    :aria-pressed="selected"
    :class="[
      'inline-flex min-h-11 items-center justify-center rounded-pill border px-4',
      'text-control transition active:scale-95',
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
      selected ? 'border-transparent bg-selected text-on-selected' : VARIANTS[variant],
    ]"
  >
    <slot />
  </button>
</template>
