import { blankCell, createGrid } from './grid.js'
import { SumiError } from './errors.js'
import type { AsciiCell, AsciiGrid, OverflowMode, TextAlign } from '../types.js'

function alignRow(row: readonly AsciiCell[], width: number, align: TextAlign): AsciiCell[] {
  if (row.length >= width) return [...row]
  const missing = width - row.length
  const left = align === 'right' ? missing : align === 'center' ? Math.floor(missing / 2) : 0
  const right = missing - left
  return [
    ...Array.from({ length: left }, blankCell),
    ...row,
    ...Array.from({ length: right }, blankCell),
  ]
}

export function constrainAndAlign(
  grid: AsciiGrid,
  width: number | undefined,
  maxWidth: number | undefined,
  align: TextAlign,
  overflow: OverflowMode,
): AsciiGrid {
  const target = width ?? (maxWidth !== undefined ? Math.min(grid.width, maxWidth) : grid.width)
  if (!Number.isFinite(target) || target < 0 || !Number.isInteger(target)) {
    throw new SumiError('INVALID_DIMENSIONS', 'width and maxWidth must be non-negative integers.')
  }
  if (overflow === 'wrap' && grid.width > target) {
    throw new SumiError(
      'INVALID_OPTIONS',
      'Wrapping must be performed before rendering so banner glyphs are not split at arbitrary columns.',
    )
  }
  if (overflow === 'preserve' && grid.width > target) return grid
  const rows = grid.rows.map((row) => {
    const clipped = row.length > target ? row.slice(0, target) : row
    return alignRow(clipped, target, align)
  })
  return createGrid(rows, grid.metadata)
}
