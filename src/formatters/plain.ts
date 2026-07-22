import type { AsciiGrid, PlainTextOptions } from '../types.js'

export function formatPlain(grid: AsciiGrid, options: PlainTextOptions = {}): string {
  const lineEnding = options.lineEnding ?? '\n'
  const lines = grid.rows.map((row) => {
    const value = row.map((item) => item.character).join('')
    return options.preserveTrailingWhitespace === true ? value : value.replace(/\s+$/u, '')
  })
  const output = lines.join(lineEnding)
  return options.finalNewline === true ? `${output}${lineEnding}` : output
}
