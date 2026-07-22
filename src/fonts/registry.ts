import { block } from './block.js'
import { mini } from './mini.js'
import { shadow } from './shadow.js'
import { slant } from './slant.js'
import { threeD } from './three-d.js'
import { SumiError } from '../core/errors.js'
import type { BuiltInFontName, SumiFont } from '../types.js'

export const builtInFonts: Readonly<Record<BuiltInFontName, SumiFont>> = Object.freeze({
  block,
  slant,
  shadow,
  mini,
  'three-d': threeD,
})

export function getBuiltInFont(name: BuiltInFontName): SumiFont {
  const font = builtInFonts[name]
  if (font === undefined) throw new SumiError('UNKNOWN_FONT', `Unknown built-in font: ${name}`)
  return font
}

export function listFonts(): readonly BuiltInFontName[] {
  return Object.freeze(Object.keys(builtInFonts) as BuiltInFontName[])
}
