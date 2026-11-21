<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    sessionName?: string
    loading?: boolean
  }>(),
  {
    sessionName: '',
    loading: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const cancelButton = ref<HTMLButtonElement | null>(null)
const sheet = ref<HTMLElement | null>(null)

function close() {
  if (props.loading) return
  emit('update:modelValue', false)
  emit('cancel')
}

function confirm() {
  if (props.loading) return
  emit('confirm')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
    return
  }
  if (event.key === 'Tab' && sheet.value) {
    const focusables = Array.from(
      sheet.value.querySelectorAll<HTMLElement>('button:not([disabled])'),
    )
    if (!focusables.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
}

let previousFocus: HTMLElement | null = null

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      previousFocus = document.activeElement as HTMLElement | null
      document.addEventListener('keydown', onKeydown)
      document.body.style.overflow = 'hidden'
      await nextTick()
      cancelButton.value?.focus()
    } else {
      document.removeEventListener('keydown', onKeydown)
      document.body.style.overflow = ''
      previousFocus?.focus?.()
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
        @click.self="close"
      >
        <Transition
          appear
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="translate-y-full"
          enter-to-class="translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="translate-y-0"
          leave-to-class="translate-y-full"
        >
          <section
            v-if="modelValue"
            ref="sheet"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-session-title"
            aria-describedby="delete-session-desc"
            class="w-full max-w-md rounded-t-3xl bg-white px-6 pb-8 pt-3 shadow-2xl dark:bg-neutral-900"
          >
            <div
              class="mx-auto mb-5 h-1.5 w-10 rounded-full bg-neutral-300 dark:bg-neutral-700"
              aria-hidden="true"
            />

            <div class="flex flex-col items-center text-center">
              <div
                class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                aria-hidden="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-6 w-6"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
              </div>

              <h2
                id="delete-session-title"
                class="text-lg font-semibold text-neutral-900 dark:text-white"
              >
                ¿Borrar esta sesión?
              </h2>
              <p
                id="delete-session-desc"
                class="mt-2 text-sm text-neutral-600 dark:text-neutral-400"
              >
                <template v-if="sessionName">
                  Vas a borrar
                  <strong class="font-medium text-neutral-900 dark:text-white">{{
                    sessionName
                  }}</strong
                  >.
                </template>
                Esta acción no se puede deshacer y perderás su historial.
              </p>
            </div>

            <div class="mt-6 flex flex-col gap-3">
              <button
                type="button"
                class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-neutral-900"
                :disabled="loading"
                :aria-busy="loading"
                @click="confirm"
              >
                <svg
                  v-if="loading"
                  class="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                    class="opacity-25"
                  />
                  <path
                    d="M4 12a8 8 0 0 1 8-8"
                    stroke="currentColor"
                    stroke-width="4"
                    stroke-linecap="round"
                    class="opacity-75"
                  />
                </svg>
                {{ loading ? 'Borrando…' : 'Borrar sesión' }}
              </button>

              <button
                ref="cancelButton"
                type="button"
                class="inline-flex h-12 w-full items-center justify-center rounded-xl border border-neutral-300 px-4 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:focus-visible:ring-offset-neutral-900"
                :disabled="loading"
                @click="close"
              >
                Cancelar
              </button>
            </div>
          </section>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
