<script setup lang="ts">
import { Card } from '../../components/Card'
import { StatCard } from '../../components/StatCard'
import { Tabs } from '../../components/Tabs'
import { EmptyState } from '../../patterns/EmptyState'

const PERIODS = [
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mes' },
  { value: 'ano', label: 'Año' },
]

export interface HistoryProps {
  /** Periodo que se está viendo. */
  period: string
  /** Las tres cifras del periodo, ya formateadas. */
  summary: { sessions: string; volume: string; maxWeight: string }
  /** Las sesiones del periodo, de la más reciente a la más antigua. */
  sessions: { id: string; date: string; dayType: string; detail: string }[]
}

const { period, summary, sessions } = defineProps<HistoryProps>()
const emit = defineEmits<{
  /** Se emite con el periodo elegido. */
  periodChange: [period: string]
  /** Se emite al pulsar la acción del estado vacío. */
  logSession: []
}>()
</script>

<template>
  <main class="mx-auto flex max-w-120 flex-col gap-8 px-5 py-6">
    <h1 class="text-h1 text-primary">Historial</h1>
    <Tabs label="Periodo" :tabs="PERIODS" :value="period" @change="emit('periodChange', $event)">
      <div class="flex flex-col gap-8">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <StatCard variant="inverse" label="Sesiones" :value="summary.sessions" />
          </div>
          <StatCard label="Volumen" :value="summary.volume" unit="kg" />
          <StatCard label="Peso máximo" :value="summary.maxWeight" unit="kg" />
        </div>
        <ul v-if="sessions.length" class="flex flex-col gap-4">
          <li v-for="session in sessions" :key="session.id">
            <Card>
              <p class="text-label uppercase text-tertiary">{{ session.date }}</p>
              <p class="mt-1 text-title">{{ session.dayType }}</p>
              <p class="text-sm text-secondary">{{ session.detail }}</p>
            </Card>
          </li>
        </ul>
        <EmptyState
          v-else
          title="Aún no hay sesiones en este periodo"
          description="Cuando registres una, aparecerá aquí."
          action-label="Registrar sesión"
          @action="emit('logSession')"
        />
      </div>
    </Tabs>
  </main>
</template>
