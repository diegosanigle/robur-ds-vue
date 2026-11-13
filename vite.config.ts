/// <reference types="vitest/config" />
import path from 'node:path'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vite'

const dirname = import.meta.dirname

// Cada story de Storybook se ejecuta como un test en un navegador real.
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
