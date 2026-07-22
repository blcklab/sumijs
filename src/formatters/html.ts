import { escapeAttribute, escapeText } from './escape.js'
import type { AsciiCell, AsciiGrid, HTMLFormatOptions } from '../types.js'

function styleKey(cell: AsciiCell): string {
  return [
    cell.foreground ?? '',
    cell.background ?? '',
    cell.bold === true ? '1' : '',
    cell.dim === true ? '1' : '',
    cell.italic === true ? '1' : '',
    cell.underline === true ? '1' : '',
  ].join('|')
}

function css(cell: AsciiCell): string {
  const parts: string[] = []
  if (cell.foreground !== undefined) parts.push(`color:${cell.foreground}`)
  if (cell.background !== undefined) parts.push(`background-color:${cell.background}`)
  if (cell.bold === true) parts.push('font-weight:700')
  if (cell.dim === true) parts.push('opacity:.7')
  if (cell.italic === true) parts.push('font-style:italic')
  if (cell.underline === true) parts.push('text-decoration:underline')
  return parts.join(';')
}

function classToken(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-|-$/gu, '')
}

function classes(cell: AsciiCell): string {
  const names = ['sumi-style']
  if (cell.foreground !== undefined) names.push(`sumi-fg-${classToken(cell.foreground)}`)
  if (cell.background !== undefined) names.push(`sumi-bg-${classToken(cell.background)}`)
  if (cell.bold === true) names.push('sumi-bold')
  if (cell.dim === true) names.push('sumi-dim')
  if (cell.italic === true) names.push('sumi-italic')
  if (cell.underline === true) names.push('sumi-underline')
  return names.join(' ')
}

function innerHTML(grid: AsciiGrid, inlineStyles: boolean): string {
  return grid.rows
    .map((row) => {
      const groups: string[] = []
      let index = 0
      while (index < row.length) {
        const first = row[index]!
        const key = styleKey(first)
        let text = first.character
        index += 1
        while (index < row.length && styleKey(row[index]!) === key) {
          text += row[index]!.character
          index += 1
        }
        const rendered = escapeText(text)
        const style = css(first)
        if (style.length === 0) {
          groups.push(rendered)
        } else if (inlineStyles) {
          groups.push(`<span style="${escapeAttribute(style)}">${rendered}</span>`)
        } else {
          groups.push(`<span class="${escapeAttribute(classes(first))}">${rendered}</span>`)
        }
      }
      return groups.join('')
    })
    .join('\n')
}

export function formatHTML(grid: AsciiGrid, options: HTMLFormatOptions = {}): string {
  const content = innerHTML(grid, options.inlineStyles ?? true)
  const includePre = options.includePre ?? true
  const className = options.className ?? 'sumi-art'
  const label = options.ariaLabel ?? grid.metadata.accessibleText ?? 'ASCII art'
  const accessible = options.accessibleText
  const pre = includePre
    ? `<pre class="${escapeAttribute(className)}" aria-label="${escapeAttribute(label)}">${content}</pre>`
    : content
  const withAccessible =
    accessible === undefined
      ? pre
      : `<span class="sumi-art__accessible" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${escapeText(accessible)}</span>${pre}`
  return options.includeContainer === true
    ? `<div class="${escapeAttribute(options.containerClassName ?? 'sumi-art-container')}">${withAccessible}</div>`
    : withAccessible
}
