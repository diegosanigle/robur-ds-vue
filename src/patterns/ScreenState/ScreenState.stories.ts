import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import ScreenState from './ScreenState.vue'
import type { ScreenStateProps } from './ScreenState.vue'

// Las props y el evento `retry`.
type Args = ScreenStateProps & { onRetry?: () => void }

const meta = {
  title: 'Patrones/ScreenState',
  component: ScreenState,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { state: 'loading' },
  decorators: [() => ({ template: '<div class="w-96"><story /></div>' })],
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

export const Loading: Story = {}

export const WithError: Story = { args: { state: 'error', onRetry: fn() } }

/** Comprueba que el error se anuncia y que Reintentar avisa. */
export const Interaccion: Story = {
  args: { state: 'error', message: 'No hay conexión. Vuelve a intentarlo cuando la tengas.', onRetry: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toHaveTextContent('No hay conexión')
    await userEvent.click(canvas.getByRole('button', { name: 'Reintentar' }))
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}
