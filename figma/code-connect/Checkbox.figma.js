// url=https://www.figma.com/design/lTMwgNScwy7MEq8CaafRGC?node-id=2-92
// source=src/components/Checkbox/Checkbox.vue
// component=Checkbox
// Generado por scripts/build-code-connect.mjs desde el contrato y figma/library.json. No se edita a mano.
import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('label')
const hint = instance.getString('hint')
const state = instance.getEnum('state', { 'default': 'default', 'checked': 'checked', 'disabled': 'disabled' })

export default {
  example: figma.code`<Checkbox${' label="' + label + '"' + (hint ? ' hint="' + hint + '"' : '') + (state === 'checked' ? ' checked' : '') + (state === 'disabled' ? ' disabled' : '')} />`,
  imports: ['import { Checkbox } from "robur-ds"'],
  id: 'Checkbox',
  metadata: { nestable: true },
}
