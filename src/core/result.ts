import { SumiError } from './errors.js'
import { formatANSI } from '../formatters/ansi.js'
import { formatHTML } from '../formatters/html.js'
import { formatJSON } from '../formatters/json.js'
import { formatPlain } from '../formatters/plain.js'
import { formatSVG } from '../formatters/svg.js'
import type {
  ANSIFormatOptions,
  AsciiGrid,
  HTMLFormatOptions,
  PlainTextOptions,
  RenderResult,
  SerializableAsciiGrid,
  StringFormatOptions,
  SVGFormatOptions,
} from '../types.js'

export class SumiRenderResult implements RenderResult {
  readonly grid: AsciiGrid
  readonly width: number
  readonly height: number

  constructor(grid: AsciiGrid) {
    this.grid = grid
    this.width = grid.width
    this.height = grid.height
    Object.freeze(this)
  }

  toString(options: StringFormatOptions = {}): string {
    const format = options.format ?? this.grid.metadata.defaultFormat ?? 'plain'
    if (format === 'plain') return this.toPlainText(options.plain)
    if (format === 'ansi') return this.toANSI(options.ansi)
    if (format === 'html') return this.toHTML(options.html)
    if (format === 'svg') return this.toSVG(options.svg)
    if (format === 'json') return JSON.stringify(this.toJSON(), null, 2)
    throw new SumiError('UNSUPPORTED_FORMAT', `Unsupported output format: ${String(format)}`)
  }

  toPlainText(options?: PlainTextOptions): string {
    return formatPlain(this.grid, options)
  }

  toANSI(options?: ANSIFormatOptions): string {
    return formatANSI(this.grid, options)
  }

  toHTML(options?: HTMLFormatOptions): string {
    return formatHTML(this.grid, options)
  }

  toSVG(options?: SVGFormatOptions): string {
    return formatSVG(this.grid, options)
  }

  toJSON(): SerializableAsciiGrid {
    return formatJSON(this.grid)
  }
}
