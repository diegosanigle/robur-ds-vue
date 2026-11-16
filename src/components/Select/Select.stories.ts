import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import Select from './Select.vue'
import type { SelectProps } from './Select.vue'

const OPTIONS = [
  { value: 'press', label: 'Press de hombro' },
  { value: 'remo', label: 'Remo con mancuerna' },
  { value: 'sentadilla', label: 'Sentadilla goblet' },
]

const meta = {
  title: 'Componentes/Select',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { label: 'Ejercicio', options: OPTIONS, placeholder: 'Elige un ejercicio' },
  decorators: [() => ({ template: '<div class="w-80"><story /></div>' })],
} satisfies Meta<SelectProps>

export default meta
type Story = StoryObj<SelectProps>

export const Default: Story = {}

export const WithHint: Story = { args: { hint: 'Solo aparecen los de la biblioteca.' } }

export const WithError: Story = { args: { error: 'Elige un ejercicio.' } }

export const Disabled: Story = { args: { disabled: true } }

/** Comprueba que el campo se nombra por su etiqueta y que cambia al elegir. */
export const Interaccion: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByRole('combobox', { name: 'Ejercicio' })
    await userEvent.selectOptions(select, 'remo')
    await expect(select).toHaveValue('remo')
  },
}
