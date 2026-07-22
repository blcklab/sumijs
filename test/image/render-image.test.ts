import { describe, expect, it } from 'vitest'
import { renderImage } from '../../src/image.js'
import type { DecodedImage } from '../../src/types.js'

function image(pixels: readonly number[], width: number, height: number): DecodedImage {
  return { width, height, data: new Uint8ClampedArray(pixels) }
}

const blackWhite = image([0, 0, 0, 255, 255, 255, 255, 255], 2, 1)

describe('renderImage', () => {
  it('maps brightness to a custom ramp', async () => {
    const result = await renderImage(blackWhite, {
      width: 2,
      height: 1,
      characters: ' .#',
      sampling: 'nearest',
    })
    expect(result.toPlainText({ preserveTrailingWhitespace: true })).toBe('# ')
  })

  it('supports inversion and color cells', async () => {
    const normal = await renderImage(blackWhite, { width: 2, height: 1, characters: ' .#' })
    const inverted = await renderImage(blackWhite, {
      width: 2,
      height: 1,
      characters: ' .#',
      invert: true,
      color: true,
    })
    expect(normal.toPlainText({ preserveTrailingWhitespace: true })).not.toBe(
      inverted.toPlainText({ preserveTrailingWhitespace: true }),
    )
    expect(inverted.grid.rows[0]?.[0]?.foreground).toBe('#000000')
  })

  it('handles transparency and alpha thresholds', async () => {
    const transparent = image([255, 0, 0, 0], 1, 1)
    const result = await renderImage(transparent, {
      width: 1,
      height: 1,
      transparentCharacter: '_',
      alphaThreshold: 1,
    })
    expect(result.toPlainText()).toBe('_')
  })

  it('rejects unsafe output dimensions before allocation', async () => {
    let thrown = false
    try {
      await renderImage(blackWhite, { width: 100, height: 100, limits: { maxOutputCells: 10 } })
    } catch {
      thrown = true
    }
    expect(thrown).toBe(true)
  })
})
