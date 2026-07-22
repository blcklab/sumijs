#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { SumiError } from '../core/errors.js'
import { renderImage } from '../image/render-image.js'
import { createNodeImageDecoder } from '../image/node.js'
import { renderText } from '../text/render-text-convenience.js'
import { listFonts } from '../fonts/registry.js'
import { booleanFlag, numberFlag, parseArgs, stringFlag } from './args.js'
import { HELP } from './help.js'
import { readPipedInput } from './input.js'
import { inferFormat, writeOutput } from './output.js'
import type {
  ANSIColorLevel,
  FrameOptions,
  OutputFormat,
  RenderResult,
  RenderTextOptions,
  StyleOptions,
} from '../types.js'

const packageJson = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
) as { readonly version: string }

const VERSION = packageJson.version

function enumValue<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  name: string,
): T | undefined {
  if (value === undefined) return undefined
  if (!allowed.includes(value as T))
    throw new SumiError('INVALID_OPTIONS', `Invalid --${name} value: ${value}`)
  return value as T
}

function styleOptions(args: ReturnType<typeof parseArgs>): StyleOptions | undefined {
  const gradient = stringFlag(args, 'gradient')
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  const color = args.flags.color
  const backgroundColor = stringFlag(args, 'background')
  if (gradient === undefined && typeof color !== 'string' && backgroundColor === undefined)
    return undefined
  return {
    ...(typeof color === 'string' ? { color } : {}),
    ...(backgroundColor === undefined ? {} : { backgroundColor }),
    ...(gradient !== undefined && gradient.length >= 2
      ? { gradient: gradient as [string, string, ...string[]] }
      : {}),
    ...(stringFlag(args, 'gradient-direction') === undefined
      ? {}
      : {
          gradientDirection: enumValue(
            stringFlag(args, 'gradient-direction'),
            ['horizontal', 'vertical', 'diagonal'],
            'gradient-direction',
          )!,
        }),
  }
}

function frameOptions(args: ReturnType<typeof parseArgs>): FrameOptions | false {
  const border = stringFlag(args, 'border')
  const padding = numberFlag(args, 'padding')
  const margin = numberFlag(args, 'margin')
  const title = stringFlag(args, 'frame-title')
  if (border === undefined && padding === undefined && margin === undefined && title === undefined)
    return false
  return {
    ...(border === undefined
      ? {}
      : { style: enumValue(border, ['single', 'double', 'rounded', 'heavy'] as const, 'border')! }),
    ...(padding === undefined ? {} : { padding }),
    ...(margin === undefined ? {} : { margin }),
    ...(title === undefined ? {} : { title }),
    ...(stringFlag(args, 'frame-title-align') === undefined
      ? {}
      : {
          titleAlign: enumValue(
            stringFlag(args, 'frame-title-align'),
            ['left', 'center', 'right'] as const,
            'frame-title-align',
          )!,
        }),
  }
}

function outputFormat(args: ReturnType<typeof parseArgs>, out: string | undefined): OutputFormat {
  return (
    enumValue(stringFlag(args, 'format'), ['plain', 'ansi', 'html', 'svg', 'json'], 'format') ??
    inferFormat(out) ??
    (process.stdout.isTTY ? 'ansi' : 'plain')
  )
}

function serialize(
  result: RenderResult,
  format: OutputFormat,
  args: ReturnType<typeof parseArgs>,
): string {
  const finalNewline = booleanFlag(args, 'final-newline')
  if (format === 'plain') return result.toPlainText({ finalNewline })
  if (format === 'ansi')
    return result.toANSI({
      finalNewline,
      colorLevel: (numberFlag(args, 'color-level') ?? 3) as ANSIColorLevel,
    })
  if (format === 'html') return result.toHTML()
  if (format === 'svg') {
    const title = stringFlag(args, 'frame-title')
    return result.toSVG(title === undefined ? {} : { title })
  }
  return `${JSON.stringify(result.toJSON(), null, 2)}${finalNewline ? '\n' : ''}`
}

async function render(args: ReturnType<typeof parseArgs>): Promise<RenderResult> {
  const image = stringFlag(args, 'image')
  const style = styleOptions(args)
  const frame = frameOptions(args)
  if (image !== undefined) {
    const width = numberFlag(args, 'width')
    const height = numberFlag(args, 'height')
    const charset = enumValue(
      stringFlag(args, 'charset'),
      ['minimal', 'standard', 'detailed', 'blocks', 'binary'] as const,
      'charset',
    )
    const characters = stringFlag(args, 'characters')
    const sampling = enumValue(
      stringFlag(args, 'sampling'),
      ['average', 'nearest'] as const,
      'sampling',
    )
    const background = stringFlag(args, 'background')
    const contrast = numberFlag(args, 'contrast')
    const brightness = numberFlag(args, 'brightness')
    const gamma = numberFlag(args, 'gamma')
    const cellRatio = numberFlag(args, 'cell-ratio')
    return renderImage(image, {
      decoder: createNodeImageDecoder(),
      ...(width === undefined ? {} : { width }),
      ...(height === undefined ? {} : { height }),
      ...(charset === undefined ? {} : { charset }),
      ...(characters === undefined ? {} : { characters }),
      ...(sampling === undefined ? {} : { sampling }),
      invert: booleanFlag(args, 'invert'),
      grayscale: booleanFlag(args, 'grayscale'),
      color: args.flags.color === true,
      ...(background === undefined ? {} : { background }),
      ...(contrast === undefined ? {} : { contrast }),
      ...(brightness === undefined ? {} : { brightness }),
      ...(gamma === undefined ? {} : { gamma }),
      dither: booleanFlag(args, 'dither'),
      ...(cellRatio === undefined ? {} : { cellRatio }),
      ...(style === undefined ? {} : { style }),
      frame,
    })
  }
  const explicit =
    stringFlag(args, 'text') ??
    (args.positionals.length > 0 ? args.positionals.join(' ') : undefined)
  const input = explicit ?? (await readPipedInput())
  if (input === undefined)
    throw new SumiError('INVALID_OPTIONS', 'Provide text, --image, piped stdin, or --help.')
  const font = enumValue(
    stringFlag(args, 'font'),
    ['block', 'slant', 'shadow', 'mini', 'three-d'] as const,
    'font',
  )
  const layout = enumValue(
    stringFlag(args, 'layout'),
    ['full', 'fitted', 'smushed'] as const,
    'layout',
  )
  const align = enumValue(stringFlag(args, 'align'), ['left', 'center', 'right'] as const, 'align')
  const width = numberFlag(args, 'width')
  const maxWidth = numberFlag(args, 'max-width')
  const overflow = enumValue(
    stringFlag(args, 'overflow'),
    ['preserve', 'clip', 'wrap'] as const,
    'overflow',
  )
  const lineSpacing = numberFlag(args, 'line-spacing')
  const letterSpacing = numberFlag(args, 'letter-spacing')
  const options: RenderTextOptions = {
    ...(font === undefined ? {} : { font }),
    ...(layout === undefined ? {} : { layout }),
    ...(align === undefined ? {} : { align }),
    ...(width === undefined ? {} : { width }),
    ...(maxWidth === undefined ? {} : { maxWidth }),
    ...(overflow === undefined ? {} : { overflow }),
    ...(lineSpacing === undefined ? {} : { lineSpacing }),
    ...(letterSpacing === undefined ? {} : { letterSpacing }),
    ...(style === undefined ? {} : { style }),
    frame,
  }
  return renderText(input, options)
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2))
  if (booleanFlag(args, 'help')) {
    process.stdout.write(HELP)
    return
  }
  if (booleanFlag(args, 'version')) {
    process.stdout.write(`${VERSION}\n`)
    return
  }
  if (booleanFlag(args, 'list-fonts')) {
    process.stdout.write(`${listFonts().join('\n')}\n`)
    return
  }
  const preview = stringFlag(args, 'preview-font')
  if (preview !== undefined) {
    const previewFont = enumValue(
      preview,
      ['block', 'slant', 'shadow', 'mini', 'three-d'] as const,
      'preview-font',
    )!
    process.stdout.write(`${renderText('SUMI', { font: previewFont }).toANSI()}\n`)
    return
  }
  const out = stringFlag(args, 'out')
  const format = outputFormat(args, out)
  const result = await render(args)
  const content = serialize(result, format, args)
  if (out === undefined) {
    process.stdout.write(content)
    if (!content.endsWith('\n') && process.stdout.isTTY) process.stdout.write('\n')
    return
  }
  await writeOutput(out, content, {
    force: booleanFlag(args, 'force'),
    mkdir: booleanFlag(args, 'mkdir'),
  })
}

main().catch((error: unknown) => {
  const sumiError =
    error instanceof SumiError
      ? error
      : new SumiError('INVALID_OPTIONS', error instanceof Error ? error.message : String(error))
  process.stderr.write(`sumijs: ${sumiError.message}\n`)
  process.exitCode = sumiError.code === 'FILE_ALREADY_EXISTS' ? 2 : 1
})
