// url=https://www.figma.com/design/lTMwgNScwy7MEq8CaafRGC?node-id=3-38
// source=src/components/Input/Input.vue
// component=Input
// Generado por scripts/build-code-connect.mjs desde el contrato y figma/library.json. No se edita a mano.
import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('label')
const hint = instance.getString('hint')
const error = instance.getString('error')
const numeric = instance.getEnum('numeric', { 'false': false, 'true': true })
const state = instance.getEnum('state', { 'default': 'default', 'focus': 'focus', 'error': 'error', 'disabled': 'disabled' })
const placeholder = instance.getString('placeholder')

export default {
  example: figma.code`<Input${' label="' + label + '"' + (hint ? ' hint="' + hint + '"' : '') + (error ? ' error="' + error + '"' : '') + (numeric ? ' numeric' : '') + (state === 'disabled' ? ' disabled' : '') + (placeholder ? ' placeholder="' + placeholder + '"' : '')} />`,
  imports: ['import { Input } from "robur-ds"'],
  id: 'Input',
  metadata: { nestable: true },
}
