<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue'
import type { InputHTMLAttributes } from 'vue'

interface Props {
  /** Texto visible que nombra la casilla. Obligatorio: una casilla sin etiqueta no es accesible. */
  label: string
  /** Detalle breve bajo la etiqueta. */
  hint?: string
}

// Todo lo que acepta un <input> nativo (disabled, name…) llega a la casilla por los atributos, no como props.
export type CheckboxProps = Props & Omit<InputHTMLAttributes, 'type'>

defineOptions({ inheritAttrs: false })
const { label, hint } = defineProps<Props>()
/** Si está marcada: `v-model` en Vue es el `checked` del <input> nativo. */
const checked = defineModel<boolean>()

const attrs = useAttrs()
const autoId = useId()
const inputId = computed(() => (attrs.id as string | undefined) ?? autoId)
const labelId = computed(() => `${inputId.value}-label`)
const hintId = computed(() => `${inputId.value}-hint`)
// La clase que llegue de fuera va al contenedor; el resto, a la casilla.
const inputAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class')))
</script>

<template>
  <label :for="inputId" :class="['flex min-h-11 cursor-pointer items-center gap-3', attrs.class]">
    <span class="grid size-6 shrink-0 place-items-center">
      <input
        v-bind="inputAttrs"
        :id="inputId"
        v-model="checked"
        type="checkbox"
        :aria-labelledby="labelId"
        :aria-describedby="hint ? hintId : undefined"
        :class="[
          'peer col-start-1 row-start-1 size-6 cursor-pointer appearance-none rounded-xs border border-control bg-surface',
          'checked:border-transparent checked:bg-action',
          'disabled:cursor-not-allowed disabled:opacity-50',
        ]"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="pointer-events-none col-start-1 row-start-1 hidden size-4 text-on-action peer-checked:block"
      >
        <path d="M3 8.5l3.5 3.5L13 5" />
      </svg>
    </span>
    <span class="flex flex-col">
      <span :id="labelId" class="text-title text-primary">{{ label }}</span>
      <span v-if="hint" :id="hintId" class="text-sm text-secondary">{{ hint }}</span>
    </span>
  </label>
</template>
