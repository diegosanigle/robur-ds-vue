import { computed, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import SessionLog from './SessionLog.vue'
import type { SessionLogProps } from './SessionLog.vue'

const PLAN: Record<string, { id: string; name: string; target: string }[]> = {
  Empuje: [
    { id: 'press', name: 'Press de hombro', target: '3 series × 12 reps' },
    { id: 'flexiones', name: 'Flexiones', target: '3 series × 15 reps' },
  ],
  Tirón: [{ id: 'remo', name: 'Remo con banda', target: '3 series × 12 reps' }],
  Pierna: [{ id: 'sentadilla', name: 'Sentadilla', target: '4 series × 10 reps' }],
}

// Las props y los eventos `dayTypeChange`, `exerciseChange` y `save`.
type Args = SessionLogProps & {
  onDayTypeChange?: (dayType: string) => void
  onExerciseChange?: (id: string, completed: boolean) => void
  onSave?: () => void
}

const meta = {
  title: 'Patrones/SessionLog',
  component: SessionLog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    dayTypes: Object.keys(PLAN),
    dayType: 'Empuje',
    exercises: PLAN.Empuje.map((exercise) => ({ ...exercise, completed: false })),
    onDayTypeChange: fn(),
    onExerciseChange: fn(),
    onSave: fn(),
  },
  decorators: [() => ({ template: '<div class="w-96"><story /></div>' })],
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const Guardando: Story = { args: { saving: true } }

/** Comprueba la regla de los tres toques: tipo de día, ejercicio hecho y guardar. */
export const TresToques: Story = {
  render: (args) => ({
    components: { SessionLog },
    setup() {
      const dayType = ref('Empuje')
      const done = ref<string[]>([])
      const exercises = computed(() => PLAN[dayType.value].map((exercise) => ({ ...exercise, completed: done.value.includes(exercise.id) })))
      const change = (id: string, completed: boolean) => {
        done.value = completed ? [...done.value, id] : done.value.filter((d) => d !== id)
      }
      return { args, dayType, exercises, change }
    },
    template: '<SessionLog v-bind="args" :day-type="dayType" :exercises="exercises" @day-type-change="dayType = $event" @exercise-change="change" />',
  }),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(within(canvas.getByRole('group', { name: 'Tipo de día' })).getByRole('button', { name: 'Pierna' }))
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Sentadilla' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Guardar sesión' }))
    await expect(canvas.getByRole('checkbox', { name: 'Sentadilla' })).toBeChecked()
    await expect(args.onSave).toHaveBeenCalledOnce()
  },
}
