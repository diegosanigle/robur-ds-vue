import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import Chip from './Chip.vue'
import type { ChipProps } from './Chip.vue'

// Las props propias, los atributos nativos del <button> y el contenido (el slot por defecto).
type Args = ChipProps & { default?: string }

const meta = {
  title: 'Componentes/Chip',
  component: Chip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { default: 'Empuje' },
  argTypes: { default: { control: 'text', table: { category: 'slots' } } },
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const Selected: Story = { args: { selected: true } }

export const Accent: Story = { args: { variant: 'accent', default: 'Nuevo' } }

export const Disabled: Story = { args: { disabled: true } }

/** Un grupo de chips para elegir el tipo de día. Comprueba que al pulsar cambia la selección. */
export const Interaccion: Story = {
  render: () => ({
    components: { Chip },
    setup: () => ({ day: ref('Empuje'), days: ['Empuje', 'Tirón', 'Pierna'] }),
    template: '<div class="flex gap-2"><Chip v-for="d in days" :key="d" :selected="day === d" @click="day = d">{{ d }}</Chip></div>',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Pierna' }))
    await expect(canvas.getByRole('button', { name: 'Pierna' })).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByRole('button', { name: 'Empuje' })).toHaveAttribute('aria-pressed', 'false')
  },
}
