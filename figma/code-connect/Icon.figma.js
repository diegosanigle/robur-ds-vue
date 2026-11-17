// url=https://www.figma.com/design/lTMwgNScwy7MEq8CaafRGC?node-id=46-231
// source=src/components/Icon/Icon.vue
// component=Icon
// Generado por scripts/build-code-connect.mjs desde el contrato y figma/library.json. No se edita a mano.
import figma from 'figma'

const instance = figma.selectedInstance
const name = instance.getEnum('name', { 'home': 'home', 'dumbbell': 'dumbbell', 'list-checks': 'list-checks', 'line-chart': 'line-chart', 'settings': 'settings', 'check': 'check', 'chevron-right': 'chevron-right', 'chevron-down': 'chevron-down', 'plus': 'plus' })
const size = instance.getEnum('size', { 'sm': 'sm', 'md': 'md', 'lg': 'lg' })

export default {
  example: figma.code`<Icon${' name="' + name + '"' + (size !== 'md' ? ' size="' + size + '"' : '')} />`,
  imports: ['import { Icon } from "robur-ds"'],
  id: 'Icon',
  metadata: { nestable: true },
}
