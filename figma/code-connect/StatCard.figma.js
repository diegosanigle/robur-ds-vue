// url=https://www.figma.com/design/lTMwgNScwy7MEq8CaafRGC?node-id=2-74
// source=src/components/StatCard/StatCard.vue
// component=StatCard
// Generado por scripts/build-code-connect.mjs desde el contrato y figma/library.json. No se edita a mano.
import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('label')
const value = instance.getString('value')
const unit = instance.getString('unit')
const variant = instance.getEnum('variant', { 'surface': 'surface', 'inverse': 'inverse' })
const series = instance.getEnum('series', { 'primary': 'primary', 'secondary': 'secondary' })

export default {
  example: figma.code`<StatCard${' label="' + label + '"' + ' value="' + value + '"' + (unit ? ' unit="' + unit + '"' : '') + (variant !== 'surface' ? ' variant="' + variant + '"' : '') + (series !== 'primary' ? ' series="' + series + '"' : '')} />`,
  imports: ['import { StatCard } from "robur-ds"'],
  id: 'StatCard',
  metadata: { nestable: true },
}
