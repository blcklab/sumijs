import { readFile } from 'node:fs/promises'
import { parseFont } from './font-parser.js'
import type { SumiFont } from '../types.js'

export async function loadFontFromFile(path: string, name = path): Promise<SumiFont> {
  return parseFont(await readFile(path, 'utf8'), name)
}
