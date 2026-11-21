<script setup lang="ts">
import { ref, computed } from 'vue'
import { SessionLog } from 'robur-ds'

interface Exercise {
  id: string
  name: string
  target: string
  completed: boolean
}

const dayTypes = ['Empuje', 'Tirón', 'Pierna', 'Descanso activo']
const dayType = ref(dayTypes[0])
const saving = ref(false)

const plan = ref<Record<string, Exercise[]>>({
  Empuje: [
    { id: 'flexiones', name: 'Flexiones', target: '3 series × 12 reps', completed: false },
    { id: 'fondos', name: 'Fondos en silla', target: '3 series × 10 reps', completed: false },
    { id: 'pike', name: 'Flexiones pike', target: '3 series × 8 reps', completed: false },
  ],
  Tirón: [
    { id: 'remo', name: 'Remo con mochila', target: '3 series × 12 reps', completed: false },
    { id: 'superman', name: 'Superman', target: '3 series × 15 reps', completed: false },
  ],
  Pierna: [
    { id: 'sentadillas', name: 'Sentadillas', target: '4 series × 15 reps', completed: false },
    { id: 'zancadas', name: 'Zancadas', target: '3 series × 10 reps', completed: false },
  ],
  'Descanso activo': [
    { id: 'movilidad', name: 'Movilidad de cadera', target: '10 minutos', completed: false },
  ],
})

const exercises = computed(() => plan.value[dayType.value] ?? [])

function onDayTypeChange(value: string) {
  dayType.value = value
}

function onExerciseChange(id: string, completed: boolean) {
  const item = exercises.value.find((e) => e.id === id)
  if (item) item.completed = completed
}

async function onSave() {
  saving.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 400))
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="bg-page p-4">
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
