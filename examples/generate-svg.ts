import { writeFile } from 'node:fs/promises'
import { renderText } from '@blcklab/sumijs'

const svg = renderText('SUMI', {
  font: 'slant',
  style: { gradient: ['#8b5cf6', '#ec4899'] },
}).toSVG({
  title: 'SumiJS',
  fontFamily: 'JetBrains Mono, monospace',
})

await writeFile('sumi.svg', svg, 'utf8')
