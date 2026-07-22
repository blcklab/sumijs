import { constrainAndAlign } from '../core/alignment.js'
import { colorToHex, parseColor } from '../core/colors.js'
import { SumiError, assertFinitePositive } from '../core/errors.js'
import { applyFrame } from '../core/frame.js'
import { createGrid } from '../core/grid.js'
import { SumiRenderResult } from '../core/result.js'
import { applyStyle } from '../core/style.js'
import { resolveCharacterRamp } from './character-ramp.js'
import { isDecodedImage, validateDecodedImage } from './decoder.js'
import { ditherBrightness } from './dithering.js'
import { relativeLuminance } from './luminance.js'
import { samplePixel } from './sampler.js'
import type {
  AsciiCell,
  DecodedImage,
  ImageInput,
  RenderImageOptions,
  RenderResult,
  RGBColor,
} from '../types.js'

const DEFAULT_LIMITS = Object.freeze({
  maxSourcePixels: 40_000_000,
  maxOutputWidth: 2_000,
  maxOutputHeight: 2_000,
  maxOutputCells: 1_000_000,
})

function dimensions(
  image: DecodedImage,
  options: RenderImageOptions,
): { width: number; height: number } {
  const preserve = options.preserveAspectRatio ?? true
  const ratio = options.cellRatio ?? 0.5
  assertFinitePositive(ratio, 'cellRatio')
  let width = options.width
  let height = options.height
  if (width === undefined && height === undefined) width = Math.min(80, image.width)
  if (width !== undefined) assertFinitePositive(width, 'width')
  if (height !== undefined) assertFinitePositive(height, 'height')
  if (preserve) {
    if (height === undefined && width !== undefined) {
      height = Math.max(1, Math.round((image.height / image.width) * width * ratio))
    } else if (width === undefined && height !== undefined) {
      width = Math.max(1, Math.round(((image.width / image.height) * height) / ratio))
    }
  }
  return { width: Math.round(width ?? image.width), height: Math.round(height ?? image.height) }
}

function validateLimits(
  image: DecodedImage,
  width: number,
  height: number,
  options: RenderImageOptions,
): void {
  const limits = { ...DEFAULT_LIMITS, ...options.limits }
  if (image.width * image.height > limits.maxSourcePixels) {
    throw new SumiError(
      'OUTPUT_TOO_LARGE',
      'The source image exceeds the configured source-pixel limit.',
    )
  }
  if (
    width > limits.maxOutputWidth ||
    height > limits.maxOutputHeight ||
    width * height > limits.maxOutputCells
  ) {
    throw new SumiError(
      'OUTPUT_TOO_LARGE',
      'The requested ASCII grid exceeds the configured output limits.',
      {
        width,
        height,
      },
    )
  }
}

function composite(pixel: RGBColor & { alpha: number }, background: RGBColor): RGBColor {
  const alpha = pixel.alpha / 255
  return {
    red: Math.round(pixel.red * alpha + background.red * (1 - alpha)),
    green: Math.round(pixel.green * alpha + background.green * (1 - alpha)),
    blue: Math.round(pixel.blue * alpha + background.blue * (1 - alpha)),
  }
}

function adjusted(value: number, options: RenderImageOptions): number {
  const contrast = options.contrast ?? 1
  const brightness = options.brightness ?? 0
  const gamma = options.gamma ?? 1
  if (!Number.isFinite(contrast) || contrast < 0)
    throw new SumiError('INVALID_OPTIONS', 'contrast must be finite and non-negative.')
  if (!Number.isFinite(brightness) || brightness < -1 || brightness > 1)
    throw new SumiError('INVALID_OPTIONS', 'brightness must be from -1 to 1.')
  assertFinitePositive(gamma, 'gamma')
  let result = (value - 0.5) * contrast + 0.5 + brightness
  result = Math.max(0, Math.min(1, result)) ** (1 / gamma)
  if (options.threshold !== undefined) {
    if (!Number.isFinite(options.threshold) || options.threshold < 0 || options.threshold > 1) {
      throw new SumiError('INVALID_OPTIONS', 'threshold must be from 0 to 1.')
    }
    result = result >= options.threshold ? 1 : 0
  }
  return options.invert === true ? 1 - result : result
}

async function decode(input: ImageInput, options: RenderImageOptions): Promise<DecodedImage> {
  if (isDecodedImage(input)) return input
  if (options.decoder === undefined) {
    throw new SumiError(
      'IMAGE_DECODER_REQUIRED',
      'Encoded image input requires a browser or Node image decoder adapter.',
    )
  }
  try {
    return await options.decoder.decode(input)
  } catch (error) {
    if (error instanceof SumiError) throw error
    throw new SumiError(
      'IMAGE_DECODE_FAILED',
      'The image decoder failed to decode the input.',
      undefined,
      error,
    )
  }
}

export async function renderImage(
  input: ImageInput,
  options: RenderImageOptions = {},
): Promise<RenderResult> {
  const image = await decode(input, options)
  validateDecodedImage(image)
  const { width, height } = dimensions(image, options)
  validateLimits(image, width, height, options)
  const ramp = resolveCharacterRamp(options.charset, options.characters)
  const background =
    options.background === undefined
      ? { red: 0, green: 0, blue: 0 }
      : parseColor(options.background)
  const alphaThreshold = options.alphaThreshold ?? 0
  if (!Number.isFinite(alphaThreshold) || alphaThreshold < 0 || alphaThreshold > 255) {
    throw new SumiError('INVALID_OPTIONS', 'alphaThreshold must be from 0 to 255.')
  }
  const sampled: Array<Array<ReturnType<typeof samplePixel>>> = []
  const brightnessMatrix: number[][] = []
  for (let y = 0; y < height; y += 1) {
    const pixelRow: Array<ReturnType<typeof samplePixel>> = []
    const brightnessRow: number[] = []
    for (let x = 0; x < width; x += 1) {
      const pixel = samplePixel(image, x, y, width, height, options.sampling ?? 'average')
      pixelRow.push(pixel)
      const composed = composite(pixel, background)
      const luminance = (options.luminance ?? relativeLuminance)(
        composed.red,
        composed.green,
        composed.blue,
        pixel.alpha,
      )
      brightnessRow.push(adjusted(luminance, options))
    }
    sampled.push(pixelRow)
    brightnessMatrix.push(brightnessRow)
  }
  const mapped =
    options.dither === true ? ditherBrightness(brightnessMatrix, ramp.length) : brightnessMatrix
  const rows = mapped.map((row, y) =>
    row.map((brightness, x): AsciiCell => {
      const pixel = sampled[y]?.[x]
      if (pixel === undefined)
        throw new SumiError('IMAGE_DECODE_FAILED', 'Internal sampler produced an incomplete grid.')
      const transparent = pixel.alpha <= alphaThreshold
      const character = transparent
        ? (options.transparentCharacter ?? ' ')
        : (ramp[Math.round((1 - brightness) * (ramp.length - 1))] ?? ramp[ramp.length - 1]!)
      const composed = composite(pixel, background)
      const foreground =
        options.color === true && !transparent
          ? colorToHex(
              options.grayscale === true
                ? {
                    red: Math.round(brightness * 255),
                    green: Math.round(brightness * 255),
                    blue: Math.round(brightness * 255),
                  }
                : composed,
            )
          : undefined
      return Object.freeze({
        character,
        sourceBrightness: brightness,
        ...(foreground === undefined ? {} : { foreground }),
      })
    }),
  )
  let grid = createGrid(rows, {
    source: 'image',
    inputWidth: image.width,
    inputHeight: image.height,
    defaultFormat: options.defaultFormat ?? 'plain',
  })
  grid = applyStyle(grid, options.style)
  grid = applyFrame(grid, options.frame)
  grid = constrainAndAlign(grid, options.outputWidth, undefined, options.align ?? 'left', 'clip')
  return new SumiRenderResult(grid)
}
