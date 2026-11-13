<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue'
import type { InputHTMLAttributes } from 'vue'

interface Props {
  /** Texto visible que nombra el campo. Obligatorio: un campo sin etiqueta no es accesible. */
  label: string
  /** Ayuda breve bajo el campo. */
  hint?: string
  /** Mensaje de error. Si existe, el campo se marca como inválido. */
  error?: string
  /** Campo de cifra de sesión: texto grande, alineado a la derecha y teclado numérico. */
  numeric?: boolean
}

// Todo lo que acepta un <input> nativo (placeholder, disabled, name…) llega al campo por los atributos, no como props.
export type InputProps = Props & InputHTMLAttributes

defineOptions({ inheritAttrs: false })
const { label, hint, error, numeric = false } = defineProps<Props>()
/** El valor del campo: `v-model` en Vue es el `value` del <input> nativo. */
const value = defineModel<string>()

const attrs = useAttrs()
const autoId = useId()
const inputId = computed(() => (attrs.id as string | undefined) ?? autoId)
const messageId = computed(() => `${inputId.value}-message`)
const message = computed(() => error ?? hint)
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="inputId" class="text-control text-primary">{{ label }}</label>
    <input
      v-bind="attrs"
      :id="inputId"
      v-model="value"
      :inputmode="numeric ? 'decimal' : undefined"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="message ? messageId : undefined"
      :class="[
        'min-h-11 w-full rounded-md border bg-surface p-3.5 text-primary shadow-sm',
        'placeholder:text-tertiary',
        'focus:border-action focus:outline-none focus:ring-3 focus:ring-focus-ring/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error ? 'border-danger' : 'border-control',
        numeric ? 'text-right text-h3 tabular-nums' : 'text-body',
      ]"
    />
    <p v-if="message" :id="messageId" :class="['text-sm', error ? 'text-danger' : 'text-tertiary']">{{ message }}</p>
  </div>
</template>
