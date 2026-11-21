<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
    actionLabel?: string
  }>(),
  {
    title: 'Aún no has entrenado esta semana',
    description: 'Registra tu primera sesión y empieza a construir tu racha.',
    actionLabel: 'Registrar sesión',
  },
)

const emit = defineEmits<{
  (e: 'register'): void
}>()
</script>

<template>
  <section
    class="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center"
    aria-labelledby="history-empty-title"
  >
    <div
      class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500"
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-7 w-7"
      >
        <rect x="3" y="4.5" width="18" height="16" rx="2" />
        <path d="M3 9.5h18M8 3v3M16 3v3" />
      </svg>
    </div>

    <div class="max-w-xs space-y-1">
      <h3 id="history-empty-title" class="text-base font-semibold text-gray-900">
        {{ title }}
      </h3>
      <p class="text-sm text-gray-600">
        {{ description }}
      </p>
    </div>

    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
      @click="emit('register')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        class="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
      {{ actionLabel }}
    </button>
  </section>
</template>
