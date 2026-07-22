import { buildFont, replaceInk } from './build-font.js'

export const block = buildFont({
  name: 'block',
  transform: (rows) => replaceInk(rows, '█'),
})

export default block
