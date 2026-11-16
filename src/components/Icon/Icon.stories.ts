import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import Icon, { ICONS } from './Icon.vue'
import type { IconProps } from './Icon.vue'

const meta = {
  title: 'Componentes/Icon',
  component: Icon,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { name: 'home' },
} satisfies Meta<IconProps>

export default meta
type Story = StoryObj<IconProps>

export const Default: Story = {}

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }

/** El juego completo, en su tamaño mayor. */
export const Juego: Story = {
  render: () => ({
    components: { Icon },
    setup: () => ({ names: Object.keys(ICONS) }),
    template: `<ul class="grid grid-cols-4 gap-6 text-primary">
      <li v-for="name in names" :key="name" class="flex flex-col items-center gap-2 text-label text-tertiary">
        <span class="text-primary"><Icon :name="name" size="lg" /></span>{{ name }}
      </li>
    </ul>`,
  }),
}

/** Con label se anuncia como imagen; sin él, queda oculto a los lectores de pantalla. */
export const ConNombre: Story = {
  args: { name: 'check', label: 'Hecho' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('img', { name: 'Hecho' })).toBeVisible()
  },
}
