// url=https://www.figma.com/design/lTMwgNScwy7MEq8CaafRGC?node-id=2-27
// source=src/components/Button/Button.vue
// component=Button
// Generado por scripts/build-code-connect.mjs desde el contrato y figma/library.json. No se edita a mano.
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { 'primary': 'primary', 'secondary': 'secondary', 'danger': 'danger', 'text': 'text' })
const loading = instance.getEnum('loading', { 'false': false, 'true': true })
const children = instance.getString('children')
const state = instance.getEnum('state', { 'default': 'default', 'disabled': 'disabled' })

export default {
  example: figma.code`<Button${(variant !== 'primary' ? ' variant="' + variant + '"' : '') + (loading ? ' loading' : '') + (state === 'disabled' ? ' disabled' : '')}>${children}</Button>`,
  imports: ['import { Button } from "robur-ds"'],
  id: 'Button',
  metadata: { nestable: true },
}
