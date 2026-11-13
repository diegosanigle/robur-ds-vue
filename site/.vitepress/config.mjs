import { readFileSync } from 'node:fs'
import { defineConfig } from 'vitepress'

// La barra lateral la genera scripts/build-docs.mjs a partir de los componentes que existen.
const sidebar = JSON.parse(readFileSync(new URL('./sidebar.json', import.meta.url), 'utf8'))

export default defineConfig({
  lang: 'es',
  title: 'Robur DS',
  description: 'Documentación del Design System de Robur, generada desde el código.',
  // En GitHub Pages la web vive en /robur-ds-vue/docs/.
  base: process.env.DOCS_BASE ?? '/',
  cleanUrls: true,
  themeConfig: {
    sidebar,
    outline: { label: 'En esta página' },
    docFooter: { prev: 'Anterior', next: 'Siguiente' },
    nav: [{ text: 'Storybook', link: 'https://diegosanigle.github.io/robur-ds-vue/' }],
    search: { provider: 'local' },
  },
})
