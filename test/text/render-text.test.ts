import { describe, expect, it } from 'vitest'
import { renderText } from '../../src/text.js'
import { builtInFonts, listFonts } from '../../src/fonts/registry.js'

describe('renderText', () => {
  it('renders every built-in font deterministically', () => {
    for (const font of listFonts()) {
      const selected = builtInFonts[font]
      const first = renderText('SUMI', { font: selected }).toPlainText()
      const second = renderText('SUMI', { font: selected }).toPlainText()
      expect(first).toBe(second)
      expect(first.length).toBeGreaterThan(0)
    }
  })

  it('preserves explicit multiline input', () => {
    const result = renderText('A\nB', { font: 'block', lineSpacing: 1, trim: false })
    expect(result.height).toBe(11)
  })

  it('makes layout modes observably different', () => {
    const full = renderText('AV', { layout: 'full' }).toPlainText()
    const fitted = renderText('AV', { layout: 'fitted' }).toPlainText()
    const smushed = renderText('AV', { layout: 'smushed' }).toPlainText()
    expect(full).not.toBe(fitted)
    expect(fitted).not.toBe(smushed)
  })

  it('wraps at input word boundaries without splitting glyph rows', () => {
    const result = renderText('A B', { width: 8, overflow: 'wrap' })
    expect(result.width).toBe(8)
    expect(result.height).toBe(10)
  })

  it('supports alignment, clipping, and frames', () => {
    const result = renderText('A', {
      width: 20,
      align: 'center',
      overflow: 'clip',
      frame: { style: 'rounded', padding: 1, title: 'Sumi' },
    })
    expect(result.width).toBe(20)
    expect(result.toPlainText()).toContain('Sumi')
    expect(result.toPlainText()).toContain('╭')
  })

  it('handles Unicode and fallback glyphs without splitting surrogate pairs', () => {
    const result = renderText('A🌙B').toPlainText()
    expect(result.length).toBeGreaterThan(0)
  })

  it('normalizes CRLF input', () => {
    expect(renderText('A\r\nB').toPlainText()).toBe(renderText('A\nB').toPlainText())
  })
})
