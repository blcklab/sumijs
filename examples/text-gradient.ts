import { renderText } from '@blcklab/sumijs/text'
import { block } from '@blcklab/sumijs/fonts/block'

const result = renderText('CREATE', {
  font: block,
  style: {
    gradient: ['#6366f1', '#ec4899', '#f59e0b'],
  },
})

console.log(result.toANSI())
