<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Chip, ExerciseRow } from 'robur-ds'

type DayType = 'push' | 'pull' | 'legs' | 'full'

interface Exercise {
  id: string
  name: string
  target: string
}

const emit = defineEmits<{
  // Se guarda la sesión con el tipo de día y los ejercicios hechos
  save: [session: { day: DayType; done: string[] }]
}>()

const dayTypes: { value: DayType; label: string }[] = [
  { value: 'push', label: 'Empuje' },
  { value: 'pull', label: 'Tirón' },
  { value: 'legs', label: 'Pierna' },
  { value: 'full', label: 'Cuerpo completo' },
]

const exercisesByDay: Record<DayType, Exercise[]> = {
  push: [
    { id: 'push-ups', name: 'Flexiones', target: '4 × 12' },
    { id: 'pike', name: 'Flexiones en pica', target: '3 × 8' },
    { id: 'dips', name: 'Fondos en silla', target: '3 × 10' },
  ],
  pull: [
    { id: 'rows', name: 'Remo con mochila', target: '4 × 10' },
    { id: 'pull-ups', name: 'Dominadas', target: '3 × 6' },
    { id: 'curl', name: 'Curl con mancuerna', target: '3 × 12' },
  ],
  legs: [
    { id: 'squat', name: 'Sentadilla', target: '4 × 15' },
    { id: 'lunge', name: 'Zancada', target: '3 × 10' },
    { id: 'bridge', name: 'Puente de glúteo', target: '3 × 15' },
  ],
  full: [
    { id: 'burpee', name: 'Burpees', target: '3 × 10' },
    { id: 'squat-f', name: 'Sentadilla', target: '3 × 12' },
    { id: 'plank', name: 'Plancha', target: '3 × 40 s' },
  ],
}

const day = ref<DayType | null>(null)
const done = ref<string[]>([])
const saving = ref(false)
const showError = ref(false)

const exercises = computed(() => (day.value ? exercisesByDay[day.value] : []))

function selectDay(value: DayType) {
  day.value = value
  done.value = []
  showError.value = false
}

function toggle(id: string) {
  done.value = done.value.includes(id)
    ? done.value.filter((x) => x !== id)
    : [...done.value, id]
}

function save() {
  if (!day.value) {
    showError.value = true
    return
  }
  saving.value = true
  emit('save', { day: day.value, done: [...done.value] })
  saving.value = false
}
</script>

<template>
  <main class="flex flex-col gap-6 p-4">
    <h1 class="text-h1 text-primary">Sesión de hoy</h1>

    <section class="flex flex-col gap-3">
      <h2 class="text-h3 text-primary">Tipo de día</h2>
      <div role="group" aria-label="Tipo de día" class="flex flex-wrap gap-2">
        <Chip
          v-for="d in dayTypes"
          :key="d.value"
          :selected="day === d.value"
          @click="selectDay(d.value)"
        >
          {{ d.label }}
        </Chip>
      </div>
      <p v-if="showError" class="text-sm text-danger" role="alert">
        Elige el tipo de día para guardar la sesión
      </p>
    </section>

    <section v-if="day" class="flex flex-col gap-3">
      <h2 class="text-h3 text-primary">Ejercicios</h2>
      <ExerciseRow
        v-for="e in exercises"
        :key="e.id"
        :name="e.name"
        :target="e.target"
        :completed="done.includes(e.id)"
        @change="toggle(e.id)"
      />
    </section>
    <p v-else class="text-body text-secondary">
      Elige el tipo de día y aquí verás sus ejercicios.
    </p>

    <Button variant="primary" full-width :loading="saving" @click="save">
      Guardar sesión
    </Button>
  </main>
</template>
