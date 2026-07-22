import { cell, createGrid } from './grid.js'
import { SumiError, assertNonNegativeInteger } from './errors.js'
import type {
  AsciiCell,
  AsciiGrid,
  BoxSpacing,
  CustomBorderCharacters,
  FrameOptions,
  TextAlign,
} from '../types.js'

const BORDERS: Readonly<Record<string, CustomBorderCharacters>> = {
  single: {
    topLeft: '┌',
    top: '─',
    topRight: '┐',
    right: '│',
    bottomRight: '┘',
    bottom: '─',
    bottomLeft: '└',
    left: '│',
  },
  double: {
    topLeft: '╔',
    top: '═',
    topRight: '╗',
    right: '║',
    bottomRight: '╝',
    bottom: '═',
    bottomLeft: '╚',
    left: '║',
  },
  rounded: {
    topLeft: '╭',
    top: '─',
    topRight: '╮',
    right: '│',
    bottomRight: '╯',
    bottom: '─',
    bottomLeft: '╰',
    left: '│',
  },
  heavy: {
    topLeft: '┏',
    top: '━',
    topRight: '┓',
    right: '┃',
    bottomRight: '┛',
    bottom: '━',
    bottomLeft: '┗',
    left: '┃',
  },
}

function spacing(value: number | BoxSpacing | undefined): Required<BoxSpacing> {
  if (typeof value === 'number') {
    assertNonNegativeInteger(value, 'frame spacing')
    return { top: value, right: value, bottom: value, left: value }
  }
  const result = {
    top: value?.top ?? 0,
    right: value?.right ?? 0,
    bottom: value?.bottom ?? 0,
    left: value?.left ?? 0,
  }
  for (const [key, item] of Object.entries(result)) assertNonNegativeInteger(item, key)
  return result
}

function borderOf(style: FrameOptions['style']): CustomBorderCharacters {
  if (style === undefined || typeof style === 'string') return BORDERS[style ?? 'single']!
  for (const [key, value] of Object.entries(style)) {
    if (Array.from(value).length !== 1) {
      throw new SumiError(
        'INVALID_OPTIONS',
        `Custom border ${key} must contain exactly one character.`,
      )
    }
  }
  return style
}

function titleLine(
  border: CustomBorderCharacters,
  width: number,
  title: string | undefined,
  align: TextAlign,
): AsciiCell[] {
  if (title === undefined || title.length === 0) {
    return [
      cell(border.topLeft),
      ...Array.from({ length: width }, () => cell(border.top)),
      cell(border.topRight),
    ]
  }
  const label = ` ${title.slice(0, Math.max(0, width - 2))} `
  const remaining = Math.max(0, width - label.length)
  const left = align === 'right' ? remaining : align === 'center' ? Math.floor(remaining / 2) : 0
  const right = remaining - left
  return [
    cell(border.topLeft),
    ...Array.from({ length: left }, () => cell(border.top)),
    ...Array.from(label, (character) => cell(character)),
    ...Array.from({ length: right }, () => cell(border.top)),
    cell(border.topRight),
  ]
}

export function applyFrame(grid: AsciiGrid, options: FrameOptions | false | undefined): AsciiGrid {
  if (options === false || options === undefined) return grid
  const border = borderOf(options.style)
  const padding = spacing(options.padding)
  const margin = spacing(options.margin)
  const innerWidth = padding.left + grid.width + padding.right
  const rows: AsciiCell[][] = []
  const fullWidth = innerWidth + 2
  const blank = (): AsciiCell[] => Array.from({ length: innerWidth }, () => cell(' '))

  rows.push(titleLine(border, innerWidth, options.title, options.titleAlign ?? 'left'))
  for (let count = 0; count < padding.top; count += 1) {
    rows.push([cell(border.left), ...blank(), cell(border.right)])
  }
  for (const row of grid.rows) {
    rows.push([
      cell(border.left),
      ...Array.from({ length: padding.left }, () => cell(' ')),
      ...row,
      ...Array.from({ length: padding.right }, () => cell(' ')),
      cell(border.right),
    ])
  }
  for (let count = 0; count < padding.bottom; count += 1) {
    rows.push([cell(border.left), ...blank(), cell(border.right)])
  }
  rows.push([
    cell(border.bottomLeft),
    ...Array.from({ length: innerWidth }, () => cell(border.bottom)),
    cell(border.bottomRight),
  ])

  const marginRows: AsciiCell[][] = []
  const marginWidth = margin.left + fullWidth + margin.right
  for (let count = 0; count < margin.top; count += 1) {
    marginRows.push(Array.from({ length: marginWidth }, () => cell(' ')))
  }
  for (const row of rows) {
    marginRows.push([
      ...Array.from({ length: margin.left }, () => cell(' ')),
      ...row,
      ...Array.from({ length: margin.right }, () => cell(' ')),
    ])
  }
  for (let count = 0; count < margin.bottom; count += 1) {
    marginRows.push(Array.from({ length: marginWidth }, () => cell(' ')))
  }
  return createGrid(marginRows, grid.metadata)
}
