import { SumiError } from '../core/errors.js'
import { isDecodedImage } from './decoder.js'
import type { DecodedImage, ImageDecoder, ImageInput } from '../types.js'

export interface BrowserImageDecoderOptions {
  readonly fetch?: typeof globalThis.fetch
  readonly requestInit?: RequestInit
}

async function toBitmapSource(
  input: ImageInput,
  options: BrowserImageDecoderOptions,
): Promise<Blob | ImageBitmapSource> {
  if (typeof input === 'string') {
    const fetcher = options.fetch ?? globalThis.fetch
    if (typeof fetcher !== 'function')
      throw new SumiError('UNSUPPORTED_INPUT', 'No fetch implementation is available.')
    const response = await fetcher(input, options.requestInit)
    if (!response.ok)
      throw new SumiError('IMAGE_DECODE_FAILED', `Unable to load image: HTTP ${response.status}.`)
    return response.blob()
  }
  if (input instanceof ArrayBuffer) return new Blob([input])
  if (input instanceof Uint8Array) return new Blob([Uint8Array.from(input).buffer])
  return input as Blob | ImageBitmapSource
}

export function createBrowserImageDecoder(options: BrowserImageDecoderOptions = {}): ImageDecoder {
  return {
    async decode(input: ImageInput): Promise<DecodedImage> {
      if (isDecodedImage(input)) return input
      if (typeof globalThis.createImageBitmap !== 'function') {
        throw new SumiError(
          'IMAGE_DECODE_FAILED',
          'createImageBitmap is required by the browser image decoder.',
        )
      }
      const source = await toBitmapSource(input, options)
      const bitmap = await globalThis.createImageBitmap(source)
      try {
        const canvas =
          typeof OffscreenCanvas === 'function'
            ? new OffscreenCanvas(bitmap.width, bitmap.height)
            : globalThis.document?.createElement('canvas')
        if (canvas === undefined)
          throw new SumiError('IMAGE_DECODE_FAILED', 'Canvas APIs are unavailable.')
        canvas.width = bitmap.width
        canvas.height = bitmap.height
        const context = canvas.getContext('2d') as
          CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null
        if (context === null)
          throw new SumiError('IMAGE_DECODE_FAILED', 'Unable to create a 2D canvas context.')
        context.drawImage(bitmap, 0, 0)
        const imageData = context.getImageData(0, 0, bitmap.width, bitmap.height)
        return {
          width: bitmap.width,
          height: bitmap.height,
          data: new Uint8ClampedArray(imageData.data),
        }
      } finally {
        bitmap.close()
      }
    },
  }
}
