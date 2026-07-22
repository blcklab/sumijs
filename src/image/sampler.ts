import type { DecodedImage, SamplingMode } from '../types.js'

export interface SampledPixel {
  readonly red: number
  readonly green: number
  readonly blue: number
  readonly alpha: number
}

function pixel(image: DecodedImage, x: number, y: number): SampledPixel {
  const safeX = Math.max(0, Math.min(image.width - 1, x))
  const safeY = Math.max(0, Math.min(image.height - 1, y))
  const index = (safeY * image.width + safeX) * 4
  return {
    red: image.data[index] ?? 0,
    green: image.data[index + 1] ?? 0,
    blue: image.data[index + 2] ?? 0,
    alpha: image.data[index + 3] ?? 255,
  }
}

function nearest(
  image: DecodedImage,
  x: number,
  y: number,
  width: number,
  height: number,
): SampledPixel {
  const sourceX = Math.floor(((x + 0.5) / width) * image.width)
  const sourceY = Math.floor(((y + 0.5) / height) * image.height)
  return pixel(image, sourceX, sourceY)
}

function average(
  image: DecodedImage,
  x: number,
  y: number,
  width: number,
  height: number,
): SampledPixel {
  const startX = Math.floor((x / width) * image.width)
  const endX = Math.max(startX + 1, Math.ceil(((x + 1) / width) * image.width))
  const startY = Math.floor((y / height) * image.height)
  const endY = Math.max(startY + 1, Math.ceil(((y + 1) / height) * image.height))
  let red = 0
  let green = 0
  let blue = 0
  let alpha = 0
  let count = 0
  for (let sourceY = startY; sourceY < endY; sourceY += 1) {
    for (let sourceX = startX; sourceX < endX; sourceX += 1) {
      const value = pixel(image, sourceX, sourceY)
      red += value.red
      green += value.green
      blue += value.blue
      alpha += value.alpha
      count += 1
    }
  }
  return {
    red: Math.round(red / count),
    green: Math.round(green / count),
    blue: Math.round(blue / count),
    alpha: Math.round(alpha / count),
  }
}

export function samplePixel(
  image: DecodedImage,
  x: number,
  y: number,
  width: number,
  height: number,
  mode: SamplingMode,
): SampledPixel {
  return mode === 'nearest'
    ? nearest(image, x, y, width, height)
    : average(image, x, y, width, height)
}
