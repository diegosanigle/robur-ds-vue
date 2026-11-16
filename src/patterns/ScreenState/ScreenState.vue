<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { Button } from '../../components/Button'

export interface ScreenStateProps {
  /** `loading` mientras llegan los datos; `error` si no han podido llegar. */
  state: 'loading' | 'error'
  /** Qué ha pasado y qué hacer, en una frase. Solo en `error`. */
  message?: string
}

const { state, message } = defineProps<ScreenStateProps>()
const emit = defineEmits<{
  /** Se emite al pulsar Reintentar. Si nadie lo escucha, el error no ofrece reintento. */
  retry: []
}>()

// Un evento declarado no llega a los atributos: se mira en las props del nodo si alguien escucha @retry.
const retryable = Boolean(getCurrentInstance()?.vnode.props?.onRetry)
</script>

<template>
  <div v-if="state === 'loading'" role="status" class="px-5 py-8 text-center text-body text-tertiary">Cargando…</div>
  <div v-else role="alert" class="flex flex-col items-center gap-2 px-5 py-8 text-center">
    <h2 class="text-h3 text-primary">No se han podido cargar los datos</h2>
    <p class="text-body text-secondary">{{ message ?? 'Comprueba la conexión y vuelve a intentarlo.' }}</p>
    <div v-if="retryable" class="mt-4">
      <Button variant="secondary" @click="emit('retry')">Reintentar</Button>
    </div>
  </div>
</template>
