import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import BarChart from './BarChart.vue'
import type { BarChartProps } from './BarChart.vue'

const WEEKS = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46].map((week, i) => ({
  label: String(week),
  value: [2, 3, 1.5, 0, 2.5, 3, 4, 2, 1, 3.5, 2.75, 1][i],
}))

const meta = {
  title: 'Componentes/BarChart',
  component: BarChart,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { title: 'Volumen semanal, últimas 12 semanas', data: WEEKS },
  decorators: [() => ({ template: '<div class="w-96"><story /></div>' })],
} satisfies Meta<BarChartProps>

export default meta
type Story = StoryObj<BarChartProps>

export const Default: Story = {}

export const Inverse: Story = { args: { variant: 'inverse' } }

export const SegundaSerie: Story = { args: { variant: 'inverse', series: 'secondary' } }

/** Comprueba que la gráfica tiene nombre y que los datos se pueden leer sin ver las barras. */
export const Lectura: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('figure', { name: 'Volumen semanal, últimas 12 semanas' })).toBeVisible()
    await expect(canvas.getByRole('row', { name: '41 4' })).toBeInTheDocument()
    await expect(canvas.getByRole('row', { name: '45 2,8' })).toBeInTheDocument()
  },
}
