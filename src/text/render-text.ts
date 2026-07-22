import { constrainAndAlign } from '../core/alignment.js'
import { SumiError, assertNonNegativeInteger } from '../core/errors.js'
import { applyFrame } from '../core/frame.js'
import { gridFromStrings } from '../core/grid.js'
import { SumiRenderResult } from '../core/result.js'
import { applyStyle } from '../core/style.js'
import { block } from '../fonts/block.js'
import { joinGlyphs } from './layout.js'
import type {
  BoxSpacing,
  FrameOptions,
  RenderResult,
  SumiFont,
  TreeShakableRenderTextOptions,
} from '../types.js'

function graphemes(value: string): string[] {
  if (typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    return Array.from(segmenter.segment(value), (segment) => segment.segment)
  }
  return Array.from(value)
}

function resolveFont(font: TreeShakableRenderTextOptions['font']): SumiFont {
  if (font === undefined || font === 'block') return block
  return font
}

function glyph(font: SumiFont, character: string, fallback: string): readonly string[] {
  const direct = font.glyphs[character]
  if (direct !== undefined) return direct
  const upper = font.glyphs[character.toUpperCase()]
  if (upper !== undefined) return upper
  return (
    font.glyphs[fallback] ??
    font.glyphs['?'] ??
    font.glyphs[' '] ??
    Array.from({ length: font.height }, () => '')
  )
}

function renderLogicalLine(
  line: string,
  font: SumiFont,
  options: TreeShakableRenderTextOptions,
): string[] {
  const chars = graphemes(line)
  if (chars.length === 0) return Array.from({ length: font.height }, () => '')
  const glyphs = chars.map((character) => glyph(font, character, options.fallbackCharacter ?? '?'))
  return joinGlyphs(
    glyphs,
    options.layout ?? font.horizontalLayout ?? 'fitted',
    options.letterSpacing ?? 0,
  )
}

function spacingTotal(value: number | BoxSpacing | undefined): number {
  if (typeof value === 'number') return value * 2
  return (value?.left ?? 0) + (value?.right ?? 0)
}

function frameHorizontalOverhead(frame: FrameOptions | false | undefined): number {
  if (frame === false || frame === undefined) return 0
  return 2 + spacingTotal(frame.padding) + spacingTotal(frame.margin)
}

function renderedWidth(
  line: string,
  font: SumiFont,
  options: TreeShakableRenderTextOptions,
): number {
  return renderLogicalLine(line, font, options).reduce(
    (maximum, row) => Math.max(maximum, row.length),
    0,
  )
}

function wrapLogicalLine(
  line: string,
  targetWidth: number,
  font: SumiFont,
  options: TreeShakableRenderTextOptions,
): string[] {
  if (line.trim().length === 0) return ['']
  const words = line.trim().split(/\s+/u)
  const wrapped: string[] = []
  let current = ''

  for (const word of words) {
    const candidate = current.length === 0 ? word : `${current} ${word}`
    if (renderedWidth(candidate, font, options) <= targetWidth) {
      current = candidate
      continue
    }
    if (current.length > 0) wrapped.push(current)
    if (renderedWidth(word, font, options) > targetWidth) {
      throw new SumiError(
        'INVALID_OPTIONS',
        `The word "${word}" cannot fit within the requested wrapped banner width.`,
        { targetWidth },
      )
    }
    current = word
  }

  if (current.length > 0) wrapped.push(current)
  return wrapped
}

function trimLines(lines: string[]): string[] {
  let start = 0
  let end = lines.length
  while (start < end && lines[start]?.trim().length === 0) start += 1
  while (end > start && lines[end - 1]?.trim().length === 0) end -= 1
  return lines.slice(start, end).map((line) => line.trimEnd())
}

export function renderText(
  input: string,
  options: TreeShakableRenderTextOptions = {},
): RenderResult {
  if (typeof input !== 'string')
    throw new SumiError('UNSUPPORTED_INPUT', 'Text input must be a string.')
  const lineSpacing = options.lineSpacing ?? 0
  const letterSpacing = options.letterSpacing ?? 0
  assertNonNegativeInteger(lineSpacing, 'lineSpacing')
  assertNonNegativeInteger(letterSpacing, 'letterSpacing')
  const font = resolveFont(options.font)
  if (!Number.isInteger(font.height) || font.height <= 0) {
    throw new SumiError('INVALID_OPTIONS', 'Font height must be a positive integer.')
  }
  const normalized = input.replaceAll('\r\n', '\n').replaceAll('\r', '\n')
  const sourceLines = normalized.split('\n')
  const requestedWidth = options.width ?? options.maxWidth
  const wrapWidth =
    options.overflow === 'wrap' && requestedWidth !== undefined
      ? requestedWidth - frameHorizontalOverhead(options.frame)
      : undefined
  if (wrapWidth !== undefined && wrapWidth <= 0) {
    throw new SumiError(
      'INVALID_DIMENSIONS',
      'The requested width is too small for the configured frame.',
    )
  }
  const logicalLines =
    wrapWidth === undefined
      ? sourceLines
      : sourceLines.flatMap((line) => wrapLogicalLine(line, wrapWidth, font, options))
  const rendered: string[] = []
  logicalLines.forEach((line, index) => {
    rendered.push(...renderLogicalLine(line, font, options))
    if (index < logicalLines.length - 1) {
      rendered.push(...Array.from({ length: lineSpacing }, () => ''))
    }
  })
  const finalLines = options.trim === false ? rendered : trimLines(rendered)
  let grid = gridFromStrings(finalLines, {
    source: 'text',
    font: font.name,
    defaultFormat: options.defaultFormat ?? 'plain',
    accessibleText: input,
  })
  grid = applyStyle(grid, options.style)
  grid = applyFrame(grid, options.frame)
  const overflow =
    options.overflow === 'wrap'
      ? 'clip'
      : (options.overflow ??
        (options.width !== undefined || options.maxWidth !== undefined ? 'clip' : 'preserve'))
  grid = constrainAndAlign(grid, options.width, options.maxWidth, options.align ?? 'left', overflow)
  return new SumiRenderResult(grid)
}
