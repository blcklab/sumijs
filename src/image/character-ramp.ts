import { SumiError } from '../core/errors.js'
import type { CharacterSetName } from '../types.js'

export const CHARACTER_SETS: Readonly<Record<CharacterSetName, string>> = Object.freeze({
  minimal: ' .#',
  standard: ' .:-=+*#%@',
  detailed: ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
  blocks: ' ░▒▓█',
  binary: ' 01',
})

export function resolveCharacterRamp(
  charset: CharacterSetName | undefined,
  custom: string | undefined,
): string[] {
  const value = custom ?? CHARACTER_SETS[charset ?? 'standard']
  const characters = Array.from(value)
  if (characters.length < 2) {
    throw new SumiError(
      'INVALID_OPTIONS',
      'An image character ramp must contain at least two characters.',
    )
  }
  return characters
}
