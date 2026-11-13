<script setup lang="ts">
import { onMounted, useId, useTemplateRef, watch } from 'vue'

export interface SheetProps {
  /** La hoja está abierta. */
  open: boolean
  /** Título visible. Obligatorio: es el nombre de la hoja para lectores de pantalla. */
  title: string
}

const { open, title } = defineProps<SheetProps>()
const emit = defineEmits<{
  /** Se emite cuando la persona cierra la hoja: botón, tecla Escape o toque fuera. */
  close: []
}>()
defineSlots<{
  /** El contenido de la hoja. */
  default(): unknown
}>()

const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const titleId = useId()

// <dialog> con showModal() ya atrapa el foco, cierra con Escape y devuelve el foco al cerrar.
function sync() {
  const element = dialog.value
  if (!element) return
  if (open && !element.open) element.showModal()
  if (!open && element.open) element.close()
}
onMounted(sync)
watch(() => open, sync, { flush: 'post' })
</script>

<template>
  <dialog
    ref="dialog"
    :aria-labelledby="titleId"
    class="fixed inset-x-0 top-auto bottom-0 m-0 mx-auto w-full max-w-120 rounded-t-xl bg-surface text-primary shadow-md backdrop:bg-overlay"
    @close="emit('close')"
    @click="$event.target === dialog && emit('close')"
  >
    <div class="p-5 pb-8">
      <div aria-hidden="true" class="mx-auto mb-2 w-9 rounded-pill border-t-4 border-default" />
      <div class="mb-3 flex items-center justify-between gap-3">
        <h2 :id="titleId" class="text-h3">{{ title }}</h2>
        <button
          type="button"
          aria-label="Cerrar"
          class="grid size-11 shrink-0 place-items-center rounded-pill text-tertiary transition active:scale-95"
          @click="emit('close')"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="size-6">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <slot />
    </div>
  </dialog>
</template>
