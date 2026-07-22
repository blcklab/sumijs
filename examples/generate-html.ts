import { writeFile } from 'node:fs/promises'
import { renderText } from 'sumijs'

const result = renderText('SUMI', {
  font: 'shadow',
  style: { gradient: ['#8b5cf6', '#ec4899'] },
})

await writeFile('sumi.html', result.toHTML({ includeContainer: true }), 'utf8')
