import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import Checkbox from './Checkbox.vue'
import type { CheckboxProps } from './Checkbox.vue'

// Las props propias, los atributos nativos del <input> y el valor de v-model.
type Args = CheckboxProps & { modelValue?: boolean }

const meta = {
  title: 'Componentes/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { label: 'Flexiones' },
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const Checked: Story = { args: { modelValue: true } }

export const ConDetalle: Story = { args: { hint: '3 series × 12 reps' } }

export const Disabled: Story = { args: { disabled: true } }

/** Comprueba que se puede marcar pulsando la etiqueta, no solo la casilla. */
export const Interaccion: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Flexiones'))
    await expect(canvas.getByRole('checkbox', { name: 'Flexiones' })).toBeChecked()
  },
}
