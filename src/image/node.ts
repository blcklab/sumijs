import { readFile } from 'node:fs/promises'
import { SumiError } from '../core/errors.js'
import { isDecodedImage } from './decoder.js'
import type sharp from 'sharp'
import type { DecodedImage, ImageDecoder, ImageInput } from '../types.js'

async function inputBytes(input: ImageInput): Promise<Uint8Array> {
  if (typeof input === 'string') {
    if (/^https?:\/\//iu.test(input)) {
      const response = await fetch(input)
      if (!response.ok)
        throw new SumiError('IMAGE_DECODE_FAILED', `Unable to load image: HTTP ${response.status}.`)
      return new Uint8Array(await response.arrayBuffer())
    }
    return new Uint8Array(await readFile(input))
  }
  if (input instanceof ArrayBuffer) return new Uint8Array(input)
  if (input instanceof Uint8Array) return input
  if (typeof Blob !== 'undefined' && input instanceof Blob)
    return new Uint8Array(await input.arrayBuffer())
  throw new SumiError(
    'UNSUPPORTED_INPUT',
    'The Node image decoder supports file paths, URLs, Buffer, Uint8Array, ArrayBuffer, and Blob.',
  )
}

export function createNodeImageDecoder(): ImageDecoder {
  return {
    async decode(input: ImageInput): Promise<DecodedImage> {
      if (isDecodedImage(input)) return input
      let sharpFactory: typeof sharp
      try {
        sharpFactory = (await import('sharp')).default
      } catch (error) {
        throw new SumiError(
          'IMAGE_DECODER_REQUIRED',
          'The optional "sharp" package is required for Node image decoding. Install it with: npm install sharp',
          undefined,
          error,
        )
      }
      const bytes = await inputBytes(input)
      const decoded = await sharpFactory(bytes)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true })
      return {
        width: decoded.info.width,
        height: decoded.info.height,
        data: new Uint8ClampedArray(decoded.data),
      }
    },
  }
}
