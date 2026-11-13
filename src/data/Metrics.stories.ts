import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MetricsView from './MetricsView.vue'

const meta = {
  title: 'Datos/Métricas',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** La última medición del sistema. Se actualiza con `npm run metrics`; ningún número se escribe a mano. */
export const Resumen: Story = {
  render: () => ({ components: { MetricsView }, template: '<MetricsView />' }),
}
