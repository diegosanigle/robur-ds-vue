// url=https://www.figma.com/design/lTMwgNScwy7MEq8CaafRGC?node-id=46-252
// source=src/components/Select/Select.vue
// component=Select
// Generado por scripts/build-code-connect.mjs desde el contrato y figma/library.json. No se edita a mano.
import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('label')
const placeholder = instance.getString('placeholder')
const hint = instance.getString('hint')
const error = instance.getString('error')
const state = instance.getEnum('state', { 'default': 'default', 'focus': 'focus', 'error': 'error', 'disabled': 'disabled' })
const value = instance.getString('value')

export default {
  example: figma.code`<Select${' label="' + label + '"' + ' :options="options"' + (placeholder ? ' placeholder="' + placeholder + '"' : '') + (hint ? ' hint="' + hint + '"' : '') + (error ? ' error="' + error + '"' : '') + (state === 'disabled' ? ' disabled' : '') + (value ? ' value="' + value + '"' : '')} />`,
  imports: ['import { Select } from "robur-ds"'],
  id: 'Select',
  metadata: { nestable: true },
}
