import { renderText } from 'sumijs/text'
import { block } from 'sumijs/fonts/block'

const result = renderText('CREATE', {
  font: block,
  style: {
    gradient: ['#6366f1', '#ec4899', '#f59e0b'],
  },
})

console.log(result.toANSI())
