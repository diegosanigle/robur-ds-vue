<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { Icon } from '../Icon'

export interface ListRowProps {
  /** Lo que nombra la fila: un ejercicio, una sesión, un día tipo. */
  title: string
  /** Una línea de detalle bajo el título: fecha, series, grupo muscular. */
  detail?: string
  /** Una cifra a la derecha, ya formateada. */
  value?: string
}

const { title, detail, value } = defineProps<ListRowProps>()
const emit = defineEmits<{
  /** Se emite al pulsar la fila. Si se escucha, la fila se puede pulsar; sin acciones, lleva una flecha. */
  select: []
}>()
defineSlots<{
  /** Acciones de la fila, al final: botones `text` («Editar», «Quitar»). */
  default?(): unknown
}>()

// La fila solo es pulsable si quien la usa escucha @select. Un evento declarado no llega a los
// atributos, así que se mira en las props del nodo.
const selectable = Boolean(getCurrentInstance()?.vnode.props?.onSelect)
</script>

<template>
  <li class="flex items-center gap-3 border-b border-default last:border-b-0">
    <button
      v-if="selectable"
      type="button"
      class="flex min-h-11 flex-1 items-center gap-3 py-3.5 text-left transition active:scale-99"
      @click="emit('select')"
    >
      <span class="flex min-w-0 flex-1 flex-col">
        <span class="text-title text-primary">{{ title }}</span>
        <span v-if="detail" class="text-sm text-tertiary tabular-nums">{{ detail }}</span>
      </span>
      <span v-if="value" class="text-title text-primary tabular-nums">{{ value }}</span>
      <span v-if="!$slots.default" class="text-tertiary"><Icon name="chevron-right" /></span>
    </button>
    <div v-else class="flex min-h-11 flex-1 items-center gap-3 py-3.5">
      <span class="flex min-w-0 flex-1 flex-col">
        <span class="text-title text-primary">{{ title }}</span>
        <span v-if="detail" class="text-sm text-tertiary tabular-nums">{{ detail }}</span>
      </span>
      <span v-if="value" class="text-title text-primary tabular-nums">{{ value }}</span>
    </div>
    <div v-if="$slots.default" class="flex shrink-0 items-center gap-1"><slot /></div>
  </li>
</template>
