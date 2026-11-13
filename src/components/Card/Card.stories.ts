import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Card from './Card.vue'
import type { CardProps } from './Card.vue'

const meta = {
  title: 'Componentes/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  render: (args) => ({
    components: { Card },
    setup: () => ({ args }),
    template: '<Card v-bind="args"><p class="text-title">Tu semana</p><p class="text-sm">Tres sesiones completadas.</p></Card>',
  }),
  decorators: [() => ({ template: '<div class="w-80"><story /></div>' })],
} satisfies Meta<CardProps>

export default meta
type Story = StoryObj<CardProps>

export const Surface: Story = {}

export const Inverse: Story = { args: { variant: 'inverse' } }

export const PaddingLg: Story = { args: { padding: 'lg' } }
