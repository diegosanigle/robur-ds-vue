<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { ButtonHTMLAttributes } from 'vue'

interface Props {
  /** Jerarquía visual. Solo un `primary` por pantalla. */
  variant?: 'primary' | 'secondary' | 'danger'
  /** Ocupa todo el ancho del contenedor. */
  fullWidth?: boolean
  /** Muestra que la acción está en curso y bloquea nuevos clics. */
  loading?: boolean
}

const VARIANTS = {
  primary: 'bg-action text-on-action',
  secondary: 'bg-transparent text-primary border border-strong',
  danger: 'bg-transparent text-danger border border-danger',
}

// Todo lo que acepta un <button> nativo (disabled, type, @click…) llega por los atributos, no como props.
export type ButtonProps = Props & ButtonHTMLAttributes

defineOptions({ inheritAttrs: false })
const { variant = 'primary', fullWidth = false, loading = false } = defineProps<Props>()
defineSlots<{
  /** El texto del botón. */
  default(): unknown
}>()

const attrs = useAttrs()
const disabled = computed(() => loading || (attrs.disabled !== undefined && attrs.disabled !== false))
</script>

<template>
  <button
    type="button"
    v-bind="attrs"
    :disabled="disabled"
    :aria-busy="loading || undefined"
    :class="[
      'inline-flex min-h-11 items-center justify-center gap-2 rounded-pill px-6 py-3.5',
      'text-title transition active:scale-98',
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
      fullWidth ? 'w-full' : '',
      VARIANTS[variant],
    ]"
  >
    <template v-if="loading">Guardando…</template>
    <slot v-else />
  </button>
</template>
