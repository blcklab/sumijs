import { getBuiltInFont } from '../fonts/registry.js'
import { renderText as renderTextCore } from './render-text.js'
import type { RenderResult, RenderTextOptions, TreeShakableRenderTextOptions } from '../types.js'

export function renderText(input: string, options: RenderTextOptions = {}): RenderResult {
  const { font, ...rest } = options
  const resolvedFont = typeof font === 'string' ? getBuiltInFont(font) : font
  const coreOptions: TreeShakableRenderTextOptions = {
    ...rest,
    ...(resolvedFont === undefined ? {} : { font: resolvedFont }),
  }
  return renderTextCore(input, coreOptions)
}
