import { colorToHex, interpolateColor, parseColor, rgbToHex } from './colors.js'
import { createGrid } from './grid.js'
import type { AsciiCell, AsciiGrid, GradientDirection, StyleOptions } from '../types.js'

function gradientPosition(
  x: number,
  y: number,
  width: number,
  height: number,
  direction: GradientDirection,
): number {
  const nx = width <= 1 ? 0 : x / (width - 1)
  const ny = height <= 1 ? 0 : y / (height - 1)
  if (direction === 'vertical') return ny
  if (direction === 'diagonal') return (nx + ny) / 2
  return nx
}

export function applyStyle(grid: AsciiGrid, style: StyleOptions | undefined): AsciiGrid {
  if (style === undefined) return grid
  const gradient = style.gradient?.map(parseColor)
  const solid = style.color === undefined ? undefined : colorToHex(style.color)
  const background =
    style.backgroundColor === undefined ? undefined : colorToHex(style.backgroundColor)
  const direction = style.gradientDirection ?? 'horizontal'

  const rows = grid.rows.map((row, y) =>
    row.map((item, x): AsciiCell => {
      const isWhitespace = item.character.trim().length === 0
      let foreground = item.foreground ?? solid
      if (gradient !== undefined && (!isWhitespace || style.gradientWhitespace === true)) {
        foreground = rgbToHex(
          interpolateColor(gradient, gradientPosition(x, y, grid.width, grid.height, direction)),
        )
      }
      return Object.freeze({
        ...item,
        ...(foreground === undefined ? {} : { foreground }),
        ...(item.background === undefined && background !== undefined ? { background } : {}),
        ...(style.bold === undefined ? {} : { bold: style.bold }),
        ...(style.dim === undefined ? {} : { dim: style.dim }),
        ...(style.italic === undefined ? {} : { italic: style.italic }),
        ...(style.underline === undefined ? {} : { underline: style.underline }),
      })
    }),
  )
  return createGrid(rows, grid.metadata)
}
