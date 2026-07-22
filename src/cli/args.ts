import { SumiError } from '../core/errors.js'

export type FlagValue = string | boolean

export interface ParsedArgs {
  readonly positionals: readonly string[]
  readonly flags: Readonly<Record<string, FlagValue>>
}

const BOOLEAN_FLAGS = new Set([
  'help',
  'version',
  'list-fonts',
  'invert',
  'grayscale',
  'dither',
  'final-newline',
  'force',
  'mkdir',
])

const KNOWN_FLAGS = new Set([
  ...BOOLEAN_FLAGS,
  'text',
  'image',
  'font',
  'layout',
  'align',
  'width',
  'max-width',
  'overflow',
  'line-spacing',
  'letter-spacing',
  'charset',
  'characters',
  'height',
  'sampling',
  'color',
  'background',
  'contrast',
  'brightness',
  'gamma',
  'cell-ratio',
  'gradient',
  'gradient-direction',
  'color-level',
  'border',
  'padding',
  'margin',
  'frame-title',
  'frame-title-align',
  'format',
  'out',
  'preview-font',
])

function assertKnownFlag(name: string): void {
  if (!KNOWN_FLAGS.has(name)) {
    throw new SumiError('INVALID_OPTIONS', `Unknown flag: --${name}`)
  }
}

export function parseArgs(argv: readonly string[]): ParsedArgs {
  const positionals: string[] = []
  const flags: Record<string, FlagValue> = {}
  let index = 0
  while (index < argv.length) {
    const argument = argv[index]!
    if (argument === '--') {
      positionals.push(...argv.slice(index + 1))
      break
    }
    if (!argument.startsWith('--')) {
      positionals.push(argument)
      index += 1
      continue
    }
    const equals = argument.indexOf('=')
    if (equals !== -1) {
      const name = argument.slice(2, equals)
      assertKnownFlag(name)
      flags[name] = argument.slice(equals + 1)
      index += 1
      continue
    }
    const name = argument.slice(2)
    assertKnownFlag(name)
    if (BOOLEAN_FLAGS.has(name)) {
      flags[name] = true
      index += 1
      continue
    }
    const next = argv[index + 1]
    if (next === undefined || next.startsWith('--')) {
      if (name === 'color') {
        flags[name] = true
        index += 1
        continue
      }
      throw new SumiError('INVALID_OPTIONS', `Flag --${name} requires a value.`)
    }
    flags[name] = next
    index += 2
  }
  return Object.freeze({ positionals: Object.freeze(positionals), flags: Object.freeze(flags) })
}

export function stringFlag(args: ParsedArgs, name: string): string | undefined {
  const value = args.flags[name]
  return typeof value === 'string' ? value : undefined
}

export function booleanFlag(args: ParsedArgs, name: string): boolean {
  return args.flags[name] === true
}

export function numberFlag(args: ParsedArgs, name: string): number | undefined {
  const value = stringFlag(args, name)
  if (value === undefined) return undefined
  const parsed = Number(value)
  if (!Number.isFinite(parsed))
    throw new SumiError('INVALID_OPTIONS', `--${name} must be a number.`)
  return parsed
}
