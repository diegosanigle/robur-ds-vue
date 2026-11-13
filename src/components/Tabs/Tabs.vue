<script setup lang="ts">
import { useId, useTemplateRef } from 'vue'

export interface TabsProps {
  /** Nombre del grupo de pestañas para lectores de pantalla. */
  label: string
  /** Las pestañas, en orden. Entre dos y cuatro. */
  tabs: { value: string; label: string }[]
  /** Valor de la pestaña activa. */
  value: string
}

const { label, tabs, value } = defineProps<TabsProps>()
const emit = defineEmits<{
  /** Se emite con el valor de la pestaña elegida. */
  change: [value: string]
}>()
defineSlots<{
  /** Contenido de la pestaña activa. */
  default?(): unknown
}>()

const id = useId()
const list = useTemplateRef<HTMLDivElement>('list')

// Patrón de pestañas de WAI-ARIA: las flechas mueven el foco y la selección a la vez.
function onKeydown(event: KeyboardEvent) {
  const index = tabs.findIndex((tab) => tab.value === value)
  const moves: Record<string, number> = {
    ArrowRight: (index + 1) % tabs.length,
    ArrowLeft: (index - 1 + tabs.length) % tabs.length,
    Home: 0,
    End: tabs.length - 1,
  }
  const next = moves[event.key]
  if (next === undefined) return
  event.preventDefault()
  emit('change', tabs[next].value)
  list.value?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus()
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div ref="list" role="tablist" :aria-label="label" class="flex gap-1 rounded-pill bg-surface p-1" @keydown="onKeydown">
      <button
        v-for="tab in tabs"
        :id="`${id}-tab-${tab.value}`"
        :key="tab.value"
        type="button"
        role="tab"
        :aria-selected="tab.value === value"
        :aria-controls="tab.value === value && $slots.default ? `${id}-panel` : undefined"
        :tabindex="tab.value === value ? 0 : -1"
        :class="[
          'min-h-11 flex-1 rounded-pill px-4 text-control transition active:scale-95',
          tab.value === value ? 'bg-selected text-on-selected' : 'text-tertiary',
        ]"
        @click="emit('change', tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div v-if="$slots.default" :id="`${id}-panel`" role="tabpanel" :aria-labelledby="`${id}-tab-${value}`" tabindex="0">
      <slot />
    </div>
  </div>
</template>
