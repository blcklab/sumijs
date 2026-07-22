import { access, mkdir, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { dirname, extname } from 'node:path'
import { SumiError } from '../core/errors.js'
import type { OutputFormat } from '../types.js'

const EXTENSIONS: Readonly<Record<string, OutputFormat>> = {
  '.txt': 'plain',
  '.ansi': 'ansi',
  '.html': 'html',
  '.svg': 'svg',
  '.json': 'json',
}

export function inferFormat(path: string | undefined): OutputFormat | undefined {
  return path === undefined ? undefined : EXTENSIONS[extname(path).toLowerCase()]
}

export async function writeOutput(
  path: string,
  content: string,
  options: { readonly force: boolean; readonly mkdir: boolean },
): Promise<void> {
  if (!options.force) {
    try {
      await access(path, constants.F_OK)
      throw new SumiError('FILE_ALREADY_EXISTS', `Output file already exists: ${path}`)
    } catch (error) {
      if (error instanceof SumiError) throw error
      if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') {
        throw new SumiError(
          'INVALID_OPTIONS',
          `Unable to inspect output path: ${path}`,
          undefined,
          error,
        )
      }
    }
  }
  if (options.mkdir) await mkdir(dirname(path), { recursive: true })
  await writeFile(path, content, 'utf8')
}
