import { describe, expect, it } from 'vitest'
import { parseFont } from '../../src/fonts/font-parser.js'

function tinyFiglet(): string {
  const header = 'flf2a$ 1 1 1 0 0'
  const glyphs: string[] = []
  for (let code = 32; code <= 126; code += 1) {
    const char = String.fromCodePoint(code)
    glyphs.push(`${char === ' ' ? '$' : char}@@`)
  }
  return [header, ...glyphs].join('\n')
}

describe('parseFont', () => {
  it('parses a FIGlet-compatible font string', () => {
    const font = parseFont(tinyFiglet(), 'tiny')
    expect(font.name).toBe('tiny')
    expect(font.height).toBe(1)
    expect(font.glyphs.A?.[0]).toBe('A')
  })

  it('rejects malformed data descriptively', () => {
    expect(() => parseFont('not-a-font')).toThrow()
  })
})
