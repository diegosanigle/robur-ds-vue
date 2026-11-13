import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { cssVar, primitiveTokens, primitiveVar, semanticTokens, textStyles } from './tokens'

const meta = {
  title: 'Fundamentos/Tokens',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const swatch = 'inline-block size-10 shrink-0 rounded-sm border border-default'
const GROUPS = { text: 'Texto', bg: 'Fondos', border: 'Bordes', focus: 'Foco', heat: 'Heatmap', data: 'Datos' }

/** Los tokens que usan los componentes. Cambia el tema en la barra superior para ver sus valores en oscuro. */
export const ColoresSemanticos: Story = {
  render: () => ({
    setup: () => ({
      swatch,
      cssVar,
      groups: Object.entries(GROUPS).map(([group, title]) => ({
        group,
        title,
        tokens: semanticTokens.filter((token) => token.name.startsWith(`color.${group}.`)),
      })),
    }),
    template: `
      <div class="flex flex-col gap-8">
        <section v-for="g in groups" :key="g.group">
          <h2 class="mb-3 text-h3">{{ g.title }}</h2>
          <ul class="flex flex-col gap-2">
            <li v-for="token in g.tokens" :key="token.name" class="flex items-center gap-3">
              <span :class="swatch" :style="{ background: cssVar(token.name) }" />
              <div>
                <p class="text-sm font-semibold">{{ token.name }}</p>
                <p class="text-sm text-tertiary">{{ token.description ? token.description + ' ' : '' }}Claro: {{ token.light }} · Oscuro: {{ token.dark }}</p>
              </div>
            </li>
          </ul>
        </section>
      </div>`,
  }),
}

/** La paleta en bruto. Los componentes no la usan: solo sirve para dar valor a los semánticos. */
export const ColoresPrimitivos: Story = {
  render: () => ({
    setup: () => ({ swatch, primitiveVar, tokens: primitiveTokens.filter((token) => token.name.startsWith('color.')) }),
    template: `
      <ul class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <li v-for="token in tokens" :key="token.name" class="flex items-center gap-3">
          <span :class="swatch" :style="{ background: primitiveVar(token.name) }" />
          <div>
            <p class="text-sm font-semibold">{{ token.name.replace('color.', '') }}</p>
            <p class="text-sm text-tertiary">{{ token.value }}</p>
          </div>
        </li>
      </ul>`,
  }),
}

export const Tipografia: Story = {
  render: () => ({
    setup: () => ({
      styles: textStyles.map((token) => {
        const name = token.name.replace('text.', '')
        return {
          name,
          value: token.value as { fontSize: string; fontWeight: number; lineHeight: number },
          style: {
            fontSize: `var(--text-${name})`,
            fontWeight: `var(--text-${name}--font-weight)`,
            lineHeight: `var(--text-${name}--line-height)`,
            letterSpacing: `var(--text-${name}--letter-spacing)`,
          },
        }
      }),
    }),
    template: `
      <ul class="flex flex-col gap-6">
        <li v-for="s in styles" :key="s.name">
          <p :style="s.style">Tres sesiones esta semana</p>
          <p class="text-sm text-tertiary">text-{{ s.name }} · {{ s.value.fontSize }} · peso {{ s.value.fontWeight }} · interlineado {{ s.value.lineHeight }}</p>
        </li>
      </ul>`,
  }),
}

export const RadiosYSombras: Story = {
  render: () => ({
    setup: () => ({
      tokens: primitiveTokens
        .filter((token) => /^(radius|shadow)\./.test(token.name))
        .map((token) => {
          const name = token.name.replace('.', '-')
          const isRadius = token.name.startsWith('radius.')
          return {
            key: token.name,
            label: isRadius ? name.replace('radius', 'rounded') : name,
            value: isRadius ? String(token.value) : '',
            style: isRadius ? { borderRadius: `var(--${name})` } : { boxShadow: `var(--${name})`, borderRadius: 'var(--radius-md)' },
          }
        }),
    }),
    template: `
      <ul class="flex flex-wrap gap-6">
        <li v-for="token in tokens" :key="token.key" class="flex flex-col items-center gap-2">
          <span class="block size-20 border border-control bg-surface" :style="token.style" />
          <p class="text-sm font-semibold">{{ token.label }}</p>
          <p class="text-sm text-tertiary">{{ token.value }}</p>
        </li>
      </ul>`,
  }),
}
