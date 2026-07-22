import { buildFont } from './build-font.js'

export const mini = buildFont({
  name: 'mini',
  transform: (rows) => rows.map((row) => row.replaceAll('#', '▪').trimEnd()),
})

export default mini
