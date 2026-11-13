import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import Tabs from './Tabs.vue'
import type { TabsProps } from './Tabs.vue'

const TABS = [
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mes' },
  { value: 'ano', label: 'Año' },
]

// Las props, el evento `change` y el contenido (el slot por defecto).
type Args = TabsProps & { onChange?: (value: string) => void; default?: string }

const meta = {
  title: 'Componentes/Tabs',
  component: Tabs,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { label: 'Periodo', tabs: TABS, value: 'semana', onChange: fn() },
  argTypes: { default: { control: 'text', table: { category: 'slots' } } },
  decorators: [() => ({ template: '<div class="w-80"><story /></div>' })],
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const DosPestanas: Story = { args: { tabs: TABS.slice(0, 2) } }

export const ConContenido: Story = {
  render: (args) => ({
    components: { Tabs },
    setup: () => ({ args }),
    template: '<Tabs v-bind="args"><p class="text-body">Tres sesiones esta semana.</p></Tabs>',
  }),
}

/** Comprueba el uso con teclado: la flecha derecha pasa a la pestaña siguiente y le da el foco. */
export const Interaccion: Story = {
  render: (args) => ({
    components: { Tabs },
    setup: () => ({ args, value: ref('semana') }),
    template: '<Tabs v-bind="args" :value="value" @change="value = $event"><p class="text-body">Periodo: {{ value }}</p></Tabs>',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: 'Semana' }))
    await userEvent.keyboard('{ArrowRight}')
    const mes = canvas.getByRole('tab', { name: 'Mes' })
    await expect(mes).toHaveAttribute('aria-selected', 'true')
    await expect(mes).toHaveFocus()
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Periodo: mes')
  },
}
