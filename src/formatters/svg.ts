import { colorToHex } from '../core/colors.js'
import { SumiError } from '../core/errors.js'
import { escapeAttribute, escapeText } from './escape.js'
import type { AsciiCell, AsciiGrid, SVGFormatOptions } from '../types.js'

function validateNumber(value: number, name: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new SumiError('INVALID_OPTIONS', `${name} must be a finite number greater than zero.`)
  }
}

function styleKey(cell: AsciiCell): string {
  return [
    cell.foreground ?? '',
    cell.background ?? '',
    cell.bold ?? '',
    cell.italic ?? '',
    cell.underline ?? '',
  ].join('|')
}

function attrs(cell: AsciiCell): string {
  const values: string[] = []
  if (cell.foreground !== undefined) values.push(`fill="${escapeAttribute(cell.foreground)}"`)
  if (cell.bold === true) values.push('font-weight="700"')
  if (cell.italic === true) values.push('font-style="italic"')
  if (cell.underline === true) values.push('text-decoration="underline"')
  return values.join(' ')
}

export function formatSVG(grid: AsciiGrid, options: SVGFormatOptions = {}): string {
  const fontSize = options.fontSize ?? 16
  const lineHeight = options.lineHeight ?? 1.2
  const letterSpacing = options.letterSpacing ?? 0
  validateNumber(fontSize, 'fontSize')
  validateNumber(lineHeight, 'lineHeight')
  if (!Number.isFinite(letterSpacing))
    throw new SumiError('INVALID_OPTIONS', 'letterSpacing must be finite.')
  const characterWidth = fontSize * 0.62 + letterSpacing
  const rowHeight = fontSize * lineHeight
  const width = Math.max(1, grid.width * characterWidth)
  const height = Math.max(rowHeight, grid.height * rowHeight)
  const family = options.fontFamily ?? 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
  const title = options.title === undefined ? '' : `<title>${escapeText(options.title)}</title>`
  const description =
    options.description === undefined ? '' : `<desc>${escapeText(options.description)}</desc>`
  const label = options.ariaLabel ?? options.title ?? grid.metadata.accessibleText ?? 'ASCII art'
  const background =
    options.background === undefined || options.background === 'transparent'
      ? ''
      : `<rect width="100%" height="100%" fill="${escapeAttribute(colorToHex(options.background))}"/>`
  const rows = grid.rows
    .map((row, y) => {
      const groups: string[] = []
      let index = 0
      while (index < row.length) {
        const first = row[index]!
        const key = styleKey(first)
        const start = index
        let text = first.character
        index += 1
        while (index < row.length && styleKey(row[index]!) === key) {
          text += row[index]!.character
          index += 1
        }
        if (first.background !== undefined) {
          groups.push(
            `<rect x="${(start * characterWidth).toFixed(2)}" y="${(y * rowHeight).toFixed(2)}" width="${((index - start) * characterWidth).toFixed(2)}" height="${rowHeight.toFixed(2)}" fill="${escapeAttribute(first.background)}"/>`,
          )
        }
        groups.push(
          `<text x="${(start * characterWidth).toFixed(2)}" y="${(y * rowHeight + fontSize).toFixed(2)}" ${attrs(first)}>${escapeText(text)}</text>`,
        )
      }
      return groups.join('')
    })
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeAttribute(label)}" viewBox="0 0 ${width.toFixed(2)} ${height.toFixed(2)}" width="${width.toFixed(2)}" height="${height.toFixed(2)}"><g font-family="${escapeAttribute(family)}" font-size="${fontSize}" xml:space="preserve">${title}${description}${background}${rows}</g></svg>`
}
