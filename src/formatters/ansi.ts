import { parseColor } from '../core/colors.js'
import { formatPlain } from './plain.js'
import type {
  ANSIColorLevel,
  ANSIFormatOptions,
  AsciiCell,
  AsciiGrid,
  CellStyle,
} from '../types.js'

const RESET = '\u001B[0m'

const BASIC: readonly [number, number, number, number][] = [
  [0, 0, 0, 30],
  [205, 49, 49, 31],
  [13, 188, 121, 32],
  [229, 229, 16, 33],
  [36, 114, 200, 34],
  [188, 63, 188, 35],
  [17, 168, 205, 36],
  [229, 229, 229, 37],
]

function distance(r: number, g: number, b: number, entry: readonly number[]): number {
  return (r - (entry[0] ?? 0)) ** 2 + (g - (entry[1] ?? 0)) ** 2 + (b - (entry[2] ?? 0)) ** 2
}

function basicCode(color: string, background: boolean): number {
  const { red, green, blue } = parseColor(color)
  let best = BASIC[0]!
  for (const candidate of BASIC) {
    if (distance(red, green, blue, candidate) < distance(red, green, blue, best)) {
      best = candidate
    }
  }
  return (best[3] ?? 37) + (background ? 10 : 0)
}

function ansi256(red: number, green: number, blue: number): number {
  const r = Math.round((red / 255) * 5)
  const g = Math.round((green / 255) * 5)
  const b = Math.round((blue / 255) * 5)
  return 16 + 36 * r + 6 * g + b
}

function colorCode(color: string, background: boolean, level: ANSIColorLevel): string | undefined {
  if (level === 0) return undefined
  const { red, green, blue } = parseColor(color)
  if (level === 1) return String(basicCode(color, background))
  const prefix = background ? '48' : '38'
  if (level === 2) return `${prefix};5;${ansi256(red, green, blue)}`
  return `${prefix};2;${red};${green};${blue}`
}

function styleKey(cell: AsciiCell, level: ANSIColorLevel): string {
  return [
    level === 0 ? '' : (cell.foreground ?? ''),
    level === 0 ? '' : (cell.background ?? ''),
    cell.bold === true ? '1' : '',
    cell.dim === true ? '2' : '',
    cell.italic === true ? '3' : '',
    cell.underline === true ? '4' : '',
  ].join('|')
}

function styleCodes(style: CellStyle, level: ANSIColorLevel): string {
  const codes: string[] = []
  if (style.bold === true) codes.push('1')
  if (style.dim === true) codes.push('2')
  if (style.italic === true) codes.push('3')
  if (style.underline === true) codes.push('4')
  if (style.foreground !== undefined) {
    const value = colorCode(style.foreground, false, level)
    if (value !== undefined) codes.push(value)
  }
  if (style.background !== undefined) {
    const value = colorCode(style.background, true, level)
    if (value !== undefined) codes.push(value)
  }
  return codes.length === 0 ? '' : `\u001B[${codes.join(';')}m`
}

export function formatANSI(grid: AsciiGrid, options: ANSIFormatOptions = {}): string {
  const level = options.colorLevel ?? 3
  if (level === 0) return formatPlain(grid, options)

  const lineEnding = options.lineEnding ?? '\n'
  const lines = grid.rows.map((row) => {
    let output = ''
    let index = 0
    let activeStyle = false

    while (index < row.length) {
      const first = row[index]!
      const key = styleKey(first, level)
      let text = first.character
      index += 1
      while (index < row.length && styleKey(row[index]!, level) === key) {
        text += row[index]!.character
        index += 1
      }

      const codes = styleCodes(first, level)
      const nextStyled = codes.length > 0
      if (activeStyle) output += RESET
      if (nextStyled) output += codes
      output += text
      activeStyle = nextStyled
    }

    if (activeStyle) output += RESET
    if (options.preserveTrailingWhitespace === true) return output
    return activeStyle ? `${output.slice(0, -RESET.length).trimEnd()}${RESET}` : output.trimEnd()
  })

  const output = lines.join(lineEnding)
  return options.finalNewline === true ? `${output}${lineEnding}` : output
}
