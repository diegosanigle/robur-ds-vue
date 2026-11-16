<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue'
import type { SelectHTMLAttributes } from 'vue'
import { Icon } from '../Icon'

interface Props {
  /** Texto visible que nombra el campo. Obligatorio: un campo sin etiqueta no es accesible. */
  label: string
  /** Las opciones, en el orden en que se muestran. */
  options: { value: string; label: string }[]
  /** Texto de la opción vacía inicial. Si no se pasa, no hay opción vacía. */
  placeholder?: string
  /** Ayuda breve bajo el campo. */
  hint?: string
  /** Mensaje de error. Si existe, el campo se marca como inválido. */
  error?: string
}

// Todo lo que acepta un <select> nativo (disabled, name…) llega al campo por los atributos, no como props.
export type SelectProps = Props & SelectHTMLAttributes

defineOptions({ inheritAttrs: false })
const { label, options, placeholder, hint, error } = defineProps<Props>()
/** El valor elegido: `v-model` en Vue es el `value` del <select> nativo. */
const value = defineModel<string>()

const attrs = useAttrs()
const autoId = useId()
const selectId = computed(() => (attrs.id as string | undefined) ?? autoId)
const messageId = computed(() => `${selectId.value}-message`)
const message = computed(() => error ?? hint)
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="selectId" class="text-control text-primary">{{ label }}</label>
    <div class="relative">
      <select
        v-bind="attrs"
        :id="selectId"
        v-model="value"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="message ? messageId : undefined"
        :class="[
          'min-h-11 w-full appearance-none rounded-md border bg-surface py-3.5 pr-11 pl-3.5 text-body text-primary shadow-sm',
          'focus:border-action focus:outline-none focus:ring-3 focus:ring-focus-ring/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error ? 'border-danger' : 'border-control',
        ]"
      >
        <option v-if="placeholder !== undefined" value="">{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
      <span class="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-tertiary">
        <Icon name="chevron-down" />
      </span>
    </div>
    <p v-if="message" :id="messageId" :class="['text-sm', error ? 'text-danger' : 'text-tertiary']">{{ message }}</p>
  </div>
</template>
