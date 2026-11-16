<script setup lang="ts">
import { Icon } from '../Icon'

export interface WeekStripProps {
  /** Los siete días de la semana, de lunes a domingo. */
  days: { label: string; name: string; done?: boolean; current?: boolean }[]
}

const { days } = defineProps<WeekStripProps>()
</script>

<template>
  <ul class="flex justify-between">
    <li v-for="day in days" :key="day.name" class="flex flex-col items-center gap-2">
      <span class="sr-only">{{ day.name }}{{ day.done ? ', con sesión' : '' }}{{ day.current ? ', hoy' : '' }}</span>
      <span
        aria-hidden="true"
        :class="[
          'flex size-9 items-center justify-center rounded-pill',
          day.done ? 'bg-data-1 text-on-action' : 'border-2 border-inverse',
          day.current ? 'outline-2 outline-offset-2 outline-data-1' : '',
        ]"
      >
        <Icon v-if="day.done" name="check" />
      </span>
      <span aria-hidden="true" :class="['text-label', day.current ? 'text-on-inverse' : 'text-on-inverse-muted']">{{ day.label }}</span>
    </li>
  </ul>
</template>
