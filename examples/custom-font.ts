import { readFile } from 'node:fs/promises'
import { renderText } from '@blcklab/sumijs/text'
import { parseFont } from '@blcklab/sumijs/fonts'

const source = await readFile(new URL('./custom.flf', import.meta.url), 'utf8')
const font = parseFont(source, 'custom')

console.log(renderText('CUSTOM', { font }).toPlainText())
