import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import Input from './Input.vue'
import type { InputProps } from './Input.vue'

const meta = {
  title: 'Componentes/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { label: 'Nombre del ejercicio', placeholder: 'Press de hombro' },
  decorators: [() => ({ template: '<div class="w-80"><story /></div>' })],
} satisfies Meta<InputProps>

export default meta
// Las props propias y los atributos nativos del <input>.
type Story = StoryObj<InputProps>

export const Default: Story = {}

export const ConAyuda: Story = { args: { hint: 'Tal y como aparecerá en tu biblioteca.' } }

export const ConError: Story = { args: { error: 'Escribe un nombre para el ejercicio.' } }

export const Numerico: Story = { args: { label: 'Peso (kg)', numeric: true, placeholder: '0' } }

export const Disabled: Story = { args: { disabled: true } }

/** Comprueba que la etiqueta está asociada al campo y que se puede escribir en él. */
export const Interaccion: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Nombre del ejercicio')
    await userEvent.type(input, 'Sentadilla')
    await expect(input).toHaveValue('Sentadilla')
  },
}
