import { SumiError } from '../core/errors.js'
import type { SumiFont, TextLayout } from '../types.js'

const FIRST_CODE_POINT = 32
const LAST_CODE_POINT = 126

function removeEndMark(line: string, endMark: string, finalLine: boolean): string {
  let value = line
  const count = finalLine ? 2 : 1
  for (let index = 0; index < count && value.endsWith(endMark); index += 1) {
    value = value.slice(0, -endMark.length)
  }
  return value
}

function layoutFromHeader(oldLayout: number, fullLayout: number | undefined): TextLayout {
  const value = fullLayout ?? oldLayout
  if (value === -1) return 'full'
  if (value === 0) return 'fitted'
  return 'smushed'
}

export function parseFont(source: string, name = 'custom'): SumiFont {
  const lines = source.replaceAll('\r\n', '\n').replaceAll('\r', '\n').split('\n')
  const header = lines[0]
  if (header === undefined || !header.startsWith('flf2a') || header.length < 6) {
    throw new SumiError('MALFORMED_FONT', 'The font must start with a valid FIGlet flf2a header.')
  }
  const hardblank = header[5]!
  const fields = header.slice(6).trim().split(/\s+/u).map(Number)
  const [height, baseline, , oldLayout, commentLines, , fullLayout] = fields
  if (!Number.isInteger(height) || (height ?? 0) <= 0 || !Number.isInteger(commentLines)) {
    throw new SumiError(
      'MALFORMED_FONT',
      'The FIGlet header contains an invalid height or comment count.',
    )
  }
  const glyphs: Record<string, readonly string[]> = {}
  let cursor = 1 + (commentLines ?? 0)
  for (let codePoint = FIRST_CODE_POINT; codePoint <= LAST_CODE_POINT; codePoint += 1) {
    const glyphLines = lines.slice(cursor, cursor + height!)
    if (glyphLines.length !== height || glyphLines.some((line) => line === undefined)) {
      throw new SumiError('MALFORMED_FONT', `Font data ended while reading character ${codePoint}.`)
    }
    const endMark = glyphLines[0]?.slice(-1)
    if (endMark === undefined || endMark.length === 0) {
      throw new SumiError('MALFORMED_FONT', `Character ${codePoint} is missing an end marker.`)
    }
    glyphs[String.fromCodePoint(codePoint)] = Object.freeze(
      glyphLines.map((line, index) =>
        removeEndMark(line, endMark, index === height! - 1).replaceAll(hardblank, ' '),
      ),
    )
    cursor += height!
  }
  return Object.freeze({
    name,
    height: height!,
    ...(Number.isInteger(baseline) ? { baseline } : {}),
    hardblank,
    horizontalLayout: layoutFromHeader(oldLayout ?? 0, fullLayout),
    glyphs: Object.freeze(glyphs),
  })
}

export async function loadFontFromURL(
  url: string | URL,
  options: { readonly fetch?: typeof globalThis.fetch; readonly name?: string } = {},
): Promise<SumiFont> {
  const fetcher = options.fetch ?? globalThis.fetch
  if (typeof fetcher !== 'function') {
    throw new SumiError(
      'UNSUPPORTED_INPUT',
      'No fetch implementation is available to load the font URL.',
    )
  }
  const response = await fetcher(url)
  if (!response.ok)
    throw new SumiError('MALFORMED_FONT', `Unable to load font: HTTP ${response.status}.`)
  return parseFont(await response.text(), options.name ?? String(url))
}
