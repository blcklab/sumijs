import { buildFont, replaceInk } from './build-font.js'

export const slant = buildFont({
  name: 'slant',
  transform: (rows) =>
    replaceInk(rows, '█').map((row, index) => `${' '.repeat(rows.length - index - 1)}${row}`),
})

export default slant
