import { buildFont, replaceInk } from './build-font.js'

function shadowRows(rows: readonly string[]): readonly string[] {
  const source = replaceInk(rows, '█')
  const width = Math.max(...source.map((row) => row.length))
  const result: string[] = []
  for (let y = 0; y < source.length; y += 1) {
    const row = source[y]!.padEnd(width)
    const below = source[y - 1]?.padEnd(width) ?? ''.padEnd(width)
    let rendered = ''
    for (let x = 0; x < width; x += 1) {
      const current = row[x] ?? ' '
      const shadow = x > 0 && (below[x - 1] ?? ' ') !== ' '
      rendered += current !== ' ' ? current : shadow ? '░' : ' '
    }
    result.push(rendered)
  }
  result.push(` ${source[source.length - 1]!.replace(/█/gu, '░')}`)
  return result
}

export const shadow = buildFont({ name: 'shadow', transform: shadowRows })

export default shadow
