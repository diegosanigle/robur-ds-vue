// url=https://www.figma.com/design/lTMwgNScwy7MEq8CaafRGC?node-id=3-85
// source=src/components/Sheet/Sheet.vue
// component=Sheet
// Generado por scripts/build-code-connect.mjs desde el contrato y figma/library.json. No se edita a mano.
import figma from 'figma'

const instance = figma.selectedInstance
const title = instance.getString('title')
const children = instance.getSlot('children')

export default {
  example: figma.code`<Sheet${' :open="open"' + ' @close="onClose"' + ' title="' + title + '"'}>
  ${children}
</Sheet>`,
  imports: ['import { Sheet } from "robur-ds"'],
  id: 'Sheet',
  metadata: { nestable: true },
}
