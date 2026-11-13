// Comprueba el contraste de las parejas declaradas en tokens/contrast.json, en todos los temas.
// Uso: node scripts/check-contrast.mjs
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { resolve, root, themes } from './lib/tokens.mjs'

// Fórmula de WCAG 2: luminancia relativa de cada color y razón entre la más clara y la más oscura.
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
export function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light + 0.05) / (dark + 0.05)
}

// Solo se ejecuta la comprobación cuando el fichero se lanza directamente, no al importarlo.
if (process.argv[1] === import.meta.filename) {
  const { pairs } = JSON.parse(readFileSync(join(root, 'tokens', 'contrast.json'), 'utf8'))
  const short = (name) => name.replace('color.', '')
  let failed = 0

  for (const theme of Object.keys(themes)) {
    console.log(`\nTema ${theme}`)
    for (const { fg, bg, min } of pairs) {
      const ratio = contrast(resolve(theme, fg), resolve(theme, bg))
      const ok = ratio >= min
      if (!ok) failed++
      // Se trunca, no se redondea: 4,499 no es 4,5.
      const shown = (Math.floor(ratio * 100) / 100).toFixed(2).replace('.', ',')
      console.log(`  ${ok ? '✓' : '✗'} ${shown.padStart(5)}:1  (mín. ${min})  ${short(fg)} sobre ${short(bg)}`)
    }
  }

  if (failed) {
    console.error(`\n${failed} pareja(s) no cumplen el contraste mínimo.`)
    process.exit(1)
  }
  console.log(`\nContraste: ${pairs.length} parejas × ${Object.keys(themes).length} temas, todas cumplen.`)
}
