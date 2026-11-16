import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '../Button'
import ListRow from './ListRow.vue'
import type { ListRowProps } from './ListRow.vue'

// Las props y el evento `select`.
type Args = ListRowProps & { onSelect?: () => void }

const meta = {
  title: 'Componentes/ListRow',
  component: ListRow,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { title: 'Press de hombro', detail: '3 × 12' },
  decorators: [() => ({ template: '<ul class="w-96"><story /></ul>' })],
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

const withActions = (actions: string) => (args: Args) => ({
  components: { Button, ListRow },
  setup: () => ({ args }),
  template: `<ListRow v-bind="args">${actions}</ListRow>`,
})

export const Default: Story = {}

export const WithValue: Story = { args: { title: 'Empuje', detail: undefined, value: '12' } }

export const Selectable: Story = { args: { title: 'Empuje', detail: 'Lun 9 nov · 6 ejercicios', onSelect: fn() } }

export const WithActions: Story = {
  render: withActions('<Button variant="text">Editar</Button><Button variant="text">Quitar</Button>'),
}

/** Una lista de tres filas: la última no lleva línea debajo. */
export const Lista: Story = {
  render: () => ({
    components: { ListRow },
    setup: () => ({ noop: () => {} }),
    template: `<ListRow title="Empuje" detail="Lun 9 nov · 6 ejercicios" @select="noop" />
      <ListRow title="Tirón" detail="Mié 11 nov · 5 ejercicios" @select="noop" />
      <ListRow title="Pierna" detail="Vie 13 nov · 6 ejercicios" @select="noop" />`,
  }),
}

/** Comprueba que pulsar la fila llama a onSelect y que las acciones son botones aparte. */
export const Interaccion: Story = {
  args: { onSelect: fn() },
  render: withActions('<Button variant="text">Quitar</Button>'),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /Press de hombro/ }))
    await expect(args.onSelect).toHaveBeenCalledOnce()
    await expect(canvas.getByRole('button', { name: 'Quitar' })).toBeVisible()
  },
}
