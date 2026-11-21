<script setup lang="ts">
import { ref, computed } from 'vue'
import { SessionLog } from 'robur-ds'

const dayTypes = [
  { value: 'push', label: 'Empuje' },
  { value: 'pull', label: 'Tirón' },
  { value: 'legs', label: 'Pierna' },
]
const catalog: Record<string, { id: string; name: string; target: string }[]> = {
  push: [
    { id: 'flexiones', name: 'Flexiones', target: '3 series × 12 reps' },
    { id: 'fondos', name: 'Fondos', target: '3 series × 10 reps' },
  ],
  pull: [
    { id: 'dominadas', name: 'Dominadas', target: '3 series × 6 reps' },
    { id: 'remo', name: 'Remo con mochila', target: '3 series × 12 reps' },
  ],
  legs: [
    { id: 'sentadillas', name: 'Sentadillas', target: '4 series × 15 reps' },
    { id: 'zancadas', name: 'Zancadas', target: '3 series × 10 reps' },
  ],
}

const dayType = ref('push')
const done = ref<Record<string, boolean>>({})
const saving = ref(false)

const exercises = computed(() =>
  catalog[dayType.value].map((e) => ({ ...e, completed: !!done.value[e.id] })),
)

function onDayTypeChange(value: string) {
  dayType.value = value
}
function onExerciseChange(id: string, completed: boolean) {
  done.value = { ...done.value, [id]: completed }
}
async function onSave() {
  saving.value = true
  try {
    const ids = exercises.value.filter((e) => e.completed).map((e) => e.id)
    await new Promise((r) => setTimeout(r, 300))
    console.log({ date: '2026-11-16', dayType: dayType.value, done: ids })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="p-4">
    <SessionLog
      :day-types="dayTypes"
      :day-type="dayType"
      :exercises="exercises"
      :saving="saving"
      @day-type-change="onDayTypeChange"
      @exercise-change="onExerciseChange"
      @save="onSave"
    />
  </main>
</template>
