import { renderImage } from 'sumijs/image'
import { createNodeImageDecoder } from 'sumijs/image/node'

const result = await renderImage('./logo.png', {
  decoder: createNodeImageDecoder(),
  width: 60,
  charset: 'detailed',
  color: true,
})

console.log(result.toANSI())
