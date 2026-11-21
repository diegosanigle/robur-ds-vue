<script setup lang="ts">
import { ref } from 'vue'

type DayType = 'push' | 'pull' | 'legs'

interface DayOption {
  value: DayType
  label: string
}

const options: DayOption[] = [
  { value: 'push', label: 'Empuje' },
  { value: 'pull', label: 'Tirón' },
  { value: 'legs', label: 'Pierna' },
]

const model = defineModel<DayType>({ default: 'push' })

const buttons = ref<HTMLButtonElement[]>([])

function select(value: DayType) {
  model.value = value
}

function onKeydown(event: KeyboardEvent, index: number) {
  const last = options.length - 1
  let next = index

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      next = index === last ? 0 : index + 1
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      next = index === 0 ? last : index - 1
      break
    case 'Home':
      next = 0
      break
    case 'End':
      next = last
      break
    default:
      return
  }

  event.preventDefault()
  select(options[next].value)
  buttons.value[next]?.focus()
}
</script>

<template>
  <div
    role="radiogroup"
    aria-label="Tipo de día"
    class="inline-flex w-full gap-1 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800"
  >
    <button
      v-for="(option, index) in options"
      :key="option.value"
      :ref="(el) => { if (el) buttons[index] = el as HTMLButtonElement }"
      type="button"
      role="radio"
      :aria-checked="model === option.value"
      :tabindex="model === option.value ? 0 : -1"
      class="flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      :class="
        model === option.value
          ? 'bg-white text-neutral-900 shadow dark:bg-neutral-600 dark:text-white'
          : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
      "
      @click="select(option.value)"
      @keydown="onKeydown($event, index)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
