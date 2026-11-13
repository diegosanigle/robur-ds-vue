import { computed, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import History from './History.vue'
import type { HistoryProps } from './History.vue'

const SESSIONS = [
  { id: '1', date: 'Lun 9 nov', dayType: 'Empuje', detail: '5 ejercicios · 1.240 kg' },
  { id: '2', date: 'Mié 4 nov', dayType: 'Pierna', detail: '4 ejercicios · 1.860 kg' },
  { id: '3', date: 'Lun 2 nov', dayType: 'Tirón', detail: '5 ejercicios · 980 kg' },
]

// Las props y los eventos `periodChange` y `logSession`.
type Args = HistoryProps & { onPeriodChange?: (period: string) => void; onLogSession?: () => void }

const meta = {
  title: 'Pantallas/Historial',
  component: History,
  parameters: { layout: 'fullscreen' },
  args: {
    period: 'mes',
    onPeriodChange: fn(),
    onLogSession: fn(),
    summary: { sessions: '3', volume: '4.080', maxWeight: '62,5' },
    sessions: SESSIONS,
  },
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

export const ConSesiones: Story = {}

export const SinSesiones: Story = {
  args: { period: 'semana', summary: { sessions: '0', volume: '0', maxWeight: '0' }, sessions: [] },
}

/** Comprueba que se puede cambiar de periodo y que un periodo sin sesiones ofrece registrar una. */
export const CambioDePeriodo: Story = {
  render: (args) => ({
    components: { History },
    setup() {
      const period = ref('mes')
      const empty = computed(() => period.value === 'semana')
      const sessions = computed(() => (empty.value ? [] : SESSIONS))
      const summary = computed(() => (empty.value ? { sessions: '0', volume: '0', maxWeight: '0' } : args.summary))
      return { args, period, sessions, summary }
    },
    template: '<History v-bind="args" :period="period" :sessions="sessions" :summary="summary" @period-change="period = $event" />',
  }),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: 'Semana' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Registrar sesión' }))
    await expect(args.onLogSession).toHaveBeenCalledOnce()
  },
}
