import { renderText } from '@blcklab/sumijs/text'

const result = renderText('SUMI', {
  font: 'block',
  style: { gradient: ['#8b5cf6', '#ec4899'] },
})

const preview = document.querySelector<HTMLElement>('#preview')
if (preview !== null) preview.innerHTML = result.toHTML()
