import type { AsciiCell, AsciiGrid, RenderMetadata } from '../types.js'

export function cell(character: string, style: Omit<AsciiCell, 'character'> = {}): AsciiCell {
  return Object.freeze({ character, ...style })
}

export function blankCell(): AsciiCell {
  return cell(' ')
}

export function createGrid(
  rows: readonly (readonly AsciiCell[])[],
  metadata: RenderMetadata,
): AsciiGrid {
  const width = rows.reduce((maximum, row) => Math.max(maximum, row.length), 0)
  const normalized = rows.map((row) => {
    const cells = [...row]
    while (cells.length < width) cells.push(blankCell())
    return Object.freeze(cells)
  })
  return Object.freeze({
    width,
    height: normalized.length,
    rows: Object.freeze(normalized),
    metadata: Object.freeze({ ...metadata }),
  })
}

export function gridFromStrings(lines: readonly string[], metadata: RenderMetadata): AsciiGrid {
  return createGrid(
    lines.map((line) => Array.from(line, (character) => cell(character))),
    metadata,
  )
}

export function gridToStrings(grid: AsciiGrid): string[] {
  return grid.rows.map((row) => row.map((item) => item.character).join(''))
}
