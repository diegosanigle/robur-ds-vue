import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import LineChart from './LineChart.vue'
import type { LineChartProps } from './LineChart.vue'

const WEIGHTS = [
  { label: '05-10', value: 20 },
  { label: '12-10', value: 20 },
  { label: '19-10', value: 22.5 },
  { label: '26-10', value: 22.5 },
  { label: '02-11', value: 25 },
  { label: '09-11', value: 24 },
  { label: '16-11', value: 27.5 },
]

const meta = {
  title: 'Componentes/LineChart',
  component: LineChart,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { title: 'Press de hombro, peso (kg)', data: WEIGHTS },
  decorators: [() => ({ template: '<div class="w-96"><story /></div>' })],
} satisfies Meta<LineChartProps>

export default meta
type Story = StoryObj<LineChartProps>

export const Default: Story = {}

export const Inverse: Story = { args: { variant: 'inverse' } }

export const SegundaSerie: Story = { args: { variant: 'inverse', series: 'secondary' } }

export const UnSoloRegistro: Story = { args: { data: WEIGHTS.slice(0, 1) } }

/** Comprueba que la gráfica tiene nombre y que los datos se pueden leer sin ver la línea. */
export const Lectura: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('figure', { name: 'Press de hombro, peso (kg)' })).toBeVisible()
    await expect(canvas.getByRole('row', { name: '16-11 27,5' })).toBeInTheDocument()
  },
}
