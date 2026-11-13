import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { Button } from '../Button'
import Sheet from './Sheet.vue'
import type { SheetProps } from './Sheet.vue'

const content = '<p class="text-body">Tres sesiones: empuje, tirón y pierna.</p>'

// Las props y el evento `close`.
type Args = SheetProps & { onClose?: () => void }

const meta = {
  title: 'Componentes/Sheet',
  component: Sheet,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: { open: true, onClose: fn(), title: 'Semana 14' },
  render: (args) => ({ components: { Sheet }, setup: () => ({ args }), template: `<Sheet v-bind="args">${content}</Sheet>` }),
  decorators: [() => ({ template: '<div class="min-h-80 p-5"><story /></div>' })],
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

export const Open: Story = {}

/** Comprueba el ciclo completo: se abre desde un botón, se cierra y el foco vuelve al botón que la abrió. */
export const Interaccion: Story = {
  args: { open: false },
  render: (args) => ({
    components: { Button, Sheet },
    setup: () => ({ args, open: ref(false) }),
    template: `<Button @click="open = true">Ver semana</Button><Sheet v-bind="args" :open="open" @close="open = false">${content}</Sheet>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Ver semana' })
    await userEvent.click(trigger)
    const sheet = canvas.getByRole('dialog', { name: 'Semana 14' })
    await expect(sheet).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Cerrar' }))
    await waitFor(() => expect(sheet).not.toBeVisible())
    await expect(trigger).toHaveFocus()
  },
}
