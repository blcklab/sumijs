import { GLYPH_PATTERNS } from './glyph-patterns.js'
import type { SumiFont, TextLayout } from '../types.js'

interface BuildFontOptions {
  readonly name: string
  readonly layout?: TextLayout
  readonly transform: (rows: readonly string[], character: string) => readonly string[]
}

export function buildFont(options: BuildFontOptions): SumiFont {
  const glyphs: Record<string, readonly string[]> = {}
  for (const [character, rows] of Object.entries(GLYPH_PATTERNS)) {
    glyphs[character] = Object.freeze([...options.transform(rows, character)])
  }
  return Object.freeze({
    name: options.name,
    height: glyphs.A?.length ?? 5,
    horizontalLayout: options.layout ?? 'fitted',
    glyphs: Object.freeze(glyphs),
  })
}

export function replaceInk(rows: readonly string[], ink: string): readonly string[] {
  return rows.map((row) => row.replaceAll('#', ink))
}
