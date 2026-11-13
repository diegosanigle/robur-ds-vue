import { h } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import BottomNav from './BottomNav.vue'

// Un icono es un componente: aquí, una función que pinta un SVG de un solo trazo.
const icon = (d: string) => () =>
  h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('path', { d })])

const ITEMS = [
  { value: 'inicio', label: 'Inicio', href: '#inicio', icon: icon('M4 11l8-7 8 7v9H4z') },
  { value: 'sesion', label: 'Sesión', href: '#sesion', icon: icon('M4 12h16M7 8v8M17 8v8') },
  { value: 'plan', label: 'Plan', href: '#plan', icon: icon('M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01') },
  { value: 'progreso', label: 'Progreso', href: '#progreso', icon: icon('M4 19V5M4 19h16M8 15l4-5 3 3 4-6') },
  { value: 'ajustes', label: 'Ajustes', href: '#ajustes', icon: icon('M5 7h14M5 12h14M5 17h14') },
]

const meta = {
  title: 'Componentes/BottomNav',
  component: BottomNav,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { items: ITEMS, value: 'inicio' },
  decorators: [() => ({ template: '<div class="w-96"><story /></div>' })],
} satisfies Meta<typeof BottomNav>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TresSecciones: Story = { args: { items: ITEMS.slice(0, 3) } }

/** Comprueba que solo la sección actual se anuncia como página actual. */
export const SeccionActual: Story = {
  args: { value: 'progreso' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('link', { name: 'Progreso' })).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByRole('link', { name: 'Inicio' })).not.toHaveAttribute('aria-current')
  },
}
