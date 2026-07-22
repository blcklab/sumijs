import { SumiError } from '../core/errors.js'
import type { DecodedImage, ImageInput } from '../types.js'

export function isDecodedImage(input: ImageInput): input is DecodedImage {
  if (typeof input !== 'object' || input === null) return false
  const value = input as Partial<DecodedImage>
  return (
    Number.isInteger(value.width) &&
    Number.isInteger(value.height) &&
    value.data instanceof Uint8ClampedArray
  )
}

export function validateDecodedImage(image: DecodedImage): void {
  if (
    !Number.isInteger(image.width) ||
    image.width <= 0 ||
    !Number.isInteger(image.height) ||
    image.height <= 0
  ) {
    throw new SumiError('INVALID_DIMENSIONS', 'Decoded image dimensions must be positive integers.')
  }
  const expected = image.width * image.height * 4
  if (image.data.length !== expected) {
    throw new SumiError(
      'IMAGE_DECODE_FAILED',
      `Decoded RGBA data must contain exactly ${expected} bytes.`,
      {
        expected,
        actual: image.data.length,
      },
    )
  }
}
