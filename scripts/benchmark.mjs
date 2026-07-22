import { performance } from 'node:perf_hooks'
import { renderText } from '../dist/text.js'
import { block } from '../dist/fonts/block.js'

const iterations = 1_000
const started = performance.now()
for (let index = 0; index < iterations; index += 1) {
  renderText('SUMIJS', { font: block, layout: 'fitted' }).toPlainText()
}
const elapsed = performance.now() - started
process.stdout.write(`Rendered ${iterations} banners in ${elapsed.toFixed(2)} ms\n`)
