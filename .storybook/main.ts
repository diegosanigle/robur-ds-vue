import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.ts'],
  addons: ['@storybook/addon-vitest', '@storybook/addon-a11y', '@storybook/addon-docs'],
  // vue-component-meta lee las props, los slots y los eventos de cada .vue con sus tipos.
  framework: { name: '@storybook/vue3-vite', options: { docgen: 'vue-component-meta' } },
}

export default config
