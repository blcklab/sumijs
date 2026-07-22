import { SumiError } from './errors.js'
import type { ColorInput, RGBColor } from '../types.js'

const NAMED_COLORS: Readonly<Record<string, RGBColor>> = {
  black: { red: 0, green: 0, blue: 0 },
  red: { red: 205, green: 49, blue: 49 },
  green: { red: 13, green: 188, blue: 121 },
  yellow: { red: 229, green: 229, blue: 16 },
  blue: { red: 36, green: 114, blue: 200 },
  magenta: { red: 188, green: 63, blue: 188 },
  cyan: { red: 17, green: 168, blue: 205 },
  white: { red: 229, green: 229, blue: 229 },
  gray: { red: 128, green: 128, blue: 128 },
  grey: { red: 128, green: 128, blue: 128 },
  orange: { red: 255, green: 165, blue: 0 },
  purple: { red: 128, green: 0, blue: 128 },
  pink: { red: 255, green: 105, blue: 180 },
  transparent: { red: 0, green: 0, blue: 0 },
}

function channel(value: number): number {
  if (!Number.isFinite(value) || value < 0 || value > 255) {
    throw new SumiError('INVALID_OPTIONS', 'RGB channels must be finite values from 0 to 255.')
  }
  return Math.round(value)
}

export function parseColor(input: ColorInput): RGBColor {
  if (typeof input !== 'string') {
    return { red: channel(input.red), green: channel(input.green), blue: channel(input.blue) }
  }

  const normalized = input.trim().toLowerCase()
  const named = NAMED_COLORS[normalized]
  if (named !== undefined) return named

  const short = /^#([0-9a-f]{3})$/i.exec(normalized)
  if (short?.[1] !== undefined) {
    const [r = '0', g = '0', b = '0'] = short[1]
    return {
      red: Number.parseInt(r + r, 16),
      green: Number.parseInt(g + g, 16),
      blue: Number.parseInt(b + b, 16),
    }
  }

  const long = /^#([0-9a-f]{6})$/i.exec(normalized)
  if (long?.[1] !== undefined) {
    return {
      red: Number.parseInt(long[1].slice(0, 2), 16),
      green: Number.parseInt(long[1].slice(2, 4), 16),
      blue: Number.parseInt(long[1].slice(4, 6), 16),
    }
  }

  const rgb = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(normalized)
  if (rgb !== null) {
    return {
      red: channel(Number(rgb[1])),
      green: channel(Number(rgb[2])),
      blue: channel(Number(rgb[3])),
    }
  }

  throw new SumiError('INVALID_OPTIONS', `Unsupported or unsafe color value: ${input}`)
}

export function colorToHex(input: ColorInput): string {
  const { red, green, blue } = parseColor(input)
  return `#${[red, green, blue].map((value) => value.toString(16).padStart(2, '0')).join('')}`
}

export function interpolateColor(stops: readonly RGBColor[], position: number): RGBColor {
  if (stops.length === 0) return { red: 255, green: 255, blue: 255 }
  if (stops.length === 1) return stops[0] ?? { red: 255, green: 255, blue: 255 }
  const clamped = Math.max(0, Math.min(1, position))
  const scaled = clamped * (stops.length - 1)
  const index = Math.min(stops.length - 2, Math.floor(scaled))
  const fraction = scaled - index
  const left = stops[index] ?? stops[0]!
  const right = stops[index + 1] ?? left
  return {
    red: Math.round(left.red + (right.red - left.red) * fraction),
    green: Math.round(left.green + (right.green - left.green) * fraction),
    blue: Math.round(left.blue + (right.blue - left.blue) * fraction),
  }
}

export function rgbToHex(color: RGBColor): string {
  return colorToHex(color)
}
