import { buildFont, replaceInk } from './build-font.js'

function threeDRows(rows: readonly string[]): readonly string[] {
  const source = replaceInk(rows, '▓')
  const result = source.map((row, index) => `${' '.repeat(index)}${row}`)
  const last = source[source.length - 1] ?? ''
  result.push(`${' '.repeat(source.length)}${last.replace(/▓/gu, '▒')}`)
  return result
}

export const threeD = buildFont({ name: 'three-d', transform: threeDRows })

export default threeD
