import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'

const checks = [
  { name: 'Text entry', file: 'dist/text.js', limit: 18_000 },
  { name: 'Block font', file: 'dist/fonts/block.js', limit: 9_000 },
  { name: 'Image core', file: 'dist/image.js', limit: 22_000 },
  { name: 'Browser image adapter', file: 'dist/image/browser.js', limit: 5_000 },
  { name: 'Node image adapter', file: 'dist/image/node.js', limit: 5_000 },
  { name: 'Root convenience entry', file: 'dist/index.js', limit: 45_000 },
]

for (const check of checks) {
  const content = await readFile(check.file)
  const gzipBytes = gzipSync(content, { level: 9 }).byteLength
  assert.ok(
    gzipBytes <= check.limit,
    `${check.name} is ${gzipBytes} bytes gzip, exceeding ${check.limit} bytes.`,
  )
  process.stdout.write(`${check.name}: ${gzipBytes} bytes gzip\n`)
}
