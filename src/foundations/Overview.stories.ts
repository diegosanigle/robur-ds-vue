import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Sampler from './Sampler.vue'

const meta = {
  title: 'Resumen/Todos los componentes',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/**
 * Todos los componentes en los dos temas a la vez.
 * Sirve para ver el sistema de un vistazo y para que los tests de accesibilidad cubran también el tema oscuro.
 */
export const ClaroYOscuro: Story = {
  render: () => ({
    components: { Sampler },
    template: '<div class="grid md:grid-cols-2"><div data-theme="light"><Sampler /></div><div data-theme="dark"><Sampler /></div></div>',
  }),
}
