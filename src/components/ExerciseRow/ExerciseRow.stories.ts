import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Input } from '../Input'
import ExerciseRow from './ExerciseRow.vue'
import type { ExerciseRowProps } from './ExerciseRow.vue'

const fields = '<Input numeric label="Series" model-value="3" /><Input numeric label="Reps" model-value="12" /><Input numeric label="Peso (kg)" model-value="20" />'

// Las props y el evento `completedChange`.
type Args = ExerciseRowProps & { onCompletedChange?: (completed: boolean) => void }

const meta = {
  title: 'Componentes/ExerciseRow',
  component: ExerciseRow,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { name: 'Press de hombro', target: '3 series × 12 reps', completed: false, onCompletedChange: fn() },
  render: (args) => ({
    components: { ExerciseRow, Input },
    setup: () => ({ args }),
    template: `<ExerciseRow v-bind="args">${fields}</ExerciseRow>`,
  }),
  decorators: [() => ({ template: '<div class="w-96"><story /></div>' })],
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const Completed: Story = { args: { completed: true } }

export const SinCampos: Story = {
  args: { name: 'Plancha', target: '60 s' },
  render: (args) => ({ components: { ExerciseRow }, setup: () => ({ args }), template: '<ExerciseRow v-bind="args" />' }),
}

/** Comprueba que marcar el ejercicio avisa con el nuevo estado. */
export const Interaccion: Story = {
  render: (args) => ({
    components: { ExerciseRow, Input },
    setup() {
      const completed = ref(false)
      const change = (next: boolean) => {
        completed.value = next
        args.onCompletedChange?.(next)
      }
      return { args, completed, change }
    },
    template: `<ExerciseRow v-bind="args" :completed="completed" @completed-change="change">${fields}</ExerciseRow>`,
  }),
  play: async ({ canvasElement, args }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', { name: 'Press de hombro' })
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
    await expect(args.onCompletedChange).toHaveBeenCalledWith(true)
  },
}
