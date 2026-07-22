import { describe, expect, it } from 'vitest'
import { mini } from '../../src/fonts/mini.js'
import { renderText } from '../../src/text.js'

describe('formatters', () => {
  it('never emits ANSI from plain text', () => {
    const result = renderText('SUMI', { style: { color: '#7c3aed' } })
    expect(result.toPlainText()).not.toContain('\u001B[')
    expect(result.toANSI()).toContain('\u001B[')
  })

  it('escapes HTML and SVG user content', () => {
    const result = renderText('</pre><script>alert(1)</script>', { font: mini })
    expect(result.toHTML()).not.toContain('<script>')
    expect(result.toHTML()).toContain('&lt;')
    expect(result.toSVG({ title: '<unsafe>' })).toContain('&lt;unsafe&gt;')
  })

  it('groups styled cells and remains immutable across format calls', () => {
    const result = renderText('AB', { style: { gradient: ['#000000', '#ffffff'] } })
    const before = JSON.stringify(result.toJSON())
    result.toANSI()
    result.toHTML()
    result.toSVG()
    expect(JSON.stringify(result.toJSON())).toBe(before)
  })

  it('returns stable serializable JSON', () => {
    const value = renderText('A').toJSON()
    expect(value.version).toBe(1)
    expect(JSON.parse(JSON.stringify(value))).toEqual(value)
  })
})
