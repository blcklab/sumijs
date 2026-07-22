import type { TextLayout } from '../types.js'

function leadingSpaces(value: string): number {
  return value.length - value.trimStart().length
}

function trailingSpaces(value: string): number {
  return value.length - value.trimEnd().length
}

function smush(left: string, right: string): string | undefined {
  if (left === ' ') return right
  if (right === ' ') return left
  if (left === right) return left
  const hierarchy = '|/\\[]{}()<>'.split('')
  if (left === '_' && hierarchy.includes(right)) return right
  if (right === '_' && hierarchy.includes(left)) return left
  if ((left === '/' && right === '\\') || (left === '\\' && right === '/')) return 'X'
  if ('[]{}()<>'.includes(left) && '[]{}()<>'.includes(right)) return '|'
  return undefined
}

function canOverlap(left: readonly string[], right: readonly string[], overlap: number): boolean {
  for (let row = 0; row < left.length; row += 1) {
    const a = left[row] ?? ''
    const b = right[row] ?? ''
    for (let index = 0; index < overlap; index += 1) {
      const leftCharacter = a[a.length - overlap + index] ?? ' '
      const rightCharacter = b[index] ?? ' '
      if (smush(leftCharacter, rightCharacter) === undefined) return false
    }
  }
  return true
}

function fittedOverlap(left: readonly string[], right: readonly string[]): number {
  let available = Number.POSITIVE_INFINITY
  for (let row = 0; row < left.length; row += 1) {
    available = Math.min(
      available,
      trailingSpaces(left[row] ?? '') + leadingSpaces(right[row] ?? ''),
    )
  }
  return Number.isFinite(available) ? Math.max(0, available - 1) : 0
}

function mergeRows(left: readonly string[], right: readonly string[], overlap: number): string[] {
  return left.map((leftRow, row) => {
    const rightRow = right[row] ?? ''
    if (overlap === 0) return leftRow + rightRow
    const prefix = leftRow.slice(0, Math.max(0, leftRow.length - overlap))
    let merged = ''
    for (let index = 0; index < overlap; index += 1) {
      const a = leftRow[leftRow.length - overlap + index] ?? ' '
      const b = rightRow[index] ?? ' '
      merged += smush(a, b) ?? a
    }
    return prefix + merged + rightRow.slice(overlap)
  })
}

export function joinGlyphs(
  glyphs: readonly (readonly string[])[],
  layout: TextLayout,
  letterSpacing: number,
): string[] {
  if (glyphs.length === 0) return []
  let output = [...glyphs[0]!]
  for (const glyph of glyphs.slice(1)) {
    if (layout === 'full') {
      output = mergeRows(
        output,
        glyph.map((row) => `${' '.repeat(letterSpacing + 1)}${row}`),
        0,
      )
      continue
    }
    const fitted = fittedOverlap(output, glyph)
    let overlap = Math.max(0, fitted - letterSpacing)
    if (layout === 'smushed') {
      const candidate = overlap + 1
      if (canOverlap(output, glyph, candidate)) overlap = candidate
    }
    output = mergeRows(output, glyph, overlap)
  }
  return output
}
