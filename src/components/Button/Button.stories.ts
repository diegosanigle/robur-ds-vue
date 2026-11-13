import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import Button from './Button.vue'
import type { ButtonProps } from './Button.vue'

// Las props propias, los atributos nativos del <button> y el contenido (el slot por defecto).
type Args = ButtonProps & { default?: string }

const meta = {
  title: 'Componentes/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { default: 'Guardar sesión', onClick: fn() },
  // `default` es el slot por defecto: el contenido del botón, no un atributo.
  argTypes: { default: { control: 'text', table: { category: 'slots' } } },
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

export const Primary: Story = {}

export const Secondary: Story = { args: { variant: 'secondary', default: 'Cancelar' } }

export const Danger: Story = { args: { variant: 'danger', default: 'Borrar sesión' } }

export const Disabled: Story = { args: { disabled: true } }

export const Loading: Story = { args: { loading: true } }

export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: { layout: 'padded' },
}

/** Comprueba que un clic llama a `onClick` y que un botón deshabilitado no lo hace. */
export const Interaccion: Story = {
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Guardar sesión' })
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}
