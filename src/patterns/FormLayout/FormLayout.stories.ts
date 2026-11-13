import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Input } from '../../components/Input'
import FormLayout from './FormLayout.vue'
import type { FormLayoutProps } from './FormLayout.vue'

// Las props y los eventos `submit` y `cancel`.
type Args = FormLayoutProps & { onSubmit?: () => void; onCancel?: () => void }

const form = (fields: string) => (args: Args) => ({
  components: { FormLayout, Input },
  setup: () => ({ args }),
  template: `<FormLayout v-bind="args">${fields}</FormLayout>`,
})

const meta = {
  title: 'Patrones/FormLayout',
  component: FormLayout,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    title: 'Nuevo ejercicio',
    submitLabel: 'Guardar ejercicio',
    cancelLabel: 'Cancelar',
    onSubmit: fn(),
    onCancel: fn(),
  },
  render: form(
    '<Input label="Nombre" placeholder="Press de hombro" /><Input label="Series" numeric placeholder="0" /><Input label="Repeticiones" numeric placeholder="0" />',
  ),
  decorators: [() => ({ template: '<div class="w-96"><story /></div>' })],
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const ConError: Story = {
  render: form('<Input label="Nombre" error="Escribe un nombre para el ejercicio." /><Input label="Series" numeric model-value="3" />'),
}

export const Enviando: Story = { args: { submitting: true } }

/** Comprueba que el formulario se envía con la tecla Intro desde un campo. */
export const Interaccion: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Nombre'), 'Sentadilla{Enter}')
    await expect(args.onSubmit).toHaveBeenCalledOnce()
  },
}
