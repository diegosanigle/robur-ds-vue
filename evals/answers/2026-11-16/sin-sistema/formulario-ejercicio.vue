<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

export interface NewExercise {
  name: string
  sets: number
  reps: number
}

const emit = defineEmits<{
  (e: 'submit', payload: NewExercise): void
  (e: 'cancel'): void
}>()

const form = reactive({
  name: '',
  sets: 3,
  reps: 10,
})

const submitted = ref(false)

const errors = computed(() => ({
  name: form.name.trim() ? '' : 'El nombre es obligatorio.',
  sets:
    Number.isInteger(form.sets) && form.sets >= 1 && form.sets <= 99
      ? ''
      : 'Introduce un número de series entre 1 y 99.',
  reps:
    Number.isInteger(form.reps) && form.reps >= 1 && form.reps <= 999
      ? ''
      : 'Introduce un número de repeticiones entre 1 y 999.',
}))

const isValid = computed(() => !errors.value.name && !errors.value.sets && !errors.value.reps)

function reset() {
  form.name = ''
  form.sets = 3
  form.reps = 10
  submitted.value = false
}

function onSubmit() {
  submitted.value = true
  if (!isValid.value) return
  emit('submit', {
    name: form.name.trim(),
    sets: form.sets,
    reps: form.reps,
  })
  reset()
}

function onCancel() {
  reset()
  emit('cancel')
}
</script>

<template>
  <form
    class="mx-auto flex w-full max-w-md flex-col gap-5 rounded-xl bg-white p-6 shadow"
    novalidate
    @submit.prevent="onSubmit"
    @keydown.esc="onCancel"
  >
    <h2 class="text-xl font-semibold text-gray-900">Nuevo ejercicio</h2>

    <div class="flex flex-col gap-1">
      <label for="exercise-name" class="text-sm font-medium text-gray-700">Nombre</label>
      <input
        id="exercise-name"
        v-model="form.name"
        type="text"
        autocomplete="off"
        placeholder="Ej. Sentadillas"
        class="rounded-lg border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        :class="submitted && errors.name ? 'border-red-500' : 'border-gray-300'"
        :aria-invalid="submitted && !!errors.name"
        :aria-describedby="submitted && errors.name ? 'exercise-name-error' : undefined"
      />
      <p v-if="submitted && errors.name" id="exercise-name-error" class="text-sm text-red-600">
        {{ errors.name }}
      </p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-1">
        <label for="exercise-sets" class="text-sm font-medium text-gray-700">Series</label>
        <input
          id="exercise-sets"
          v-model.number="form.sets"
          type="number"
          inputmode="numeric"
          min="1"
          max="99"
          step="1"
          class="rounded-lg border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          :class="submitted && errors.sets ? 'border-red-500' : 'border-gray-300'"
          :aria-invalid="submitted && !!errors.sets"
          :aria-describedby="submitted && errors.sets ? 'exercise-sets-error' : undefined"
        />
        <p v-if="submitted && errors.sets" id="exercise-sets-error" class="text-sm text-red-600">
          {{ errors.sets }}
        </p>
      </div>

      <div class="flex flex-col gap-1">
        <label for="exercise-reps" class="text-sm font-medium text-gray-700">Repeticiones</label>
        <input
          id="exercise-reps"
          v-model.number="form.reps"
          type="number"
          inputmode="numeric"
          min="1"
          max="999"
          step="1"
          class="rounded-lg border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          :class="submitted && errors.reps ? 'border-red-500' : 'border-gray-300'"
          :aria-invalid="submitted && !!errors.reps"
          :aria-describedby="submitted && errors.reps ? 'exercise-reps-error' : undefined"
        />
        <p v-if="submitted && errors.reps" id="exercise-reps-error" class="text-sm text-red-600">
          {{ errors.reps }}
        </p>
      </div>
    </div>

    <div class="flex justify-end gap-3">
      <button
        type="button"
        class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        @click="onCancel"
      >
        Cancelar
      </button>
      <button
        type="submit"
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Crear ejercicio
      </button>
    </div>
  </form>
</template>
