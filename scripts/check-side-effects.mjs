import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { build } from 'esbuild'

const packageJson = JSON.parse(await readFile('package.json', 'utf8'))
assert.equal(packageJson.sideEffects, false, 'package.json must declare sideEffects: false')

const text = await readFile('dist/text.js', 'utf8')
for (const forbidden of ['threeD', 'three-d', 'slant', 'shadow', 'sharp', 'node:fs']) {
  assert.equal(text.includes(forbidden), false, `text entry unexpectedly contains ${forbidden}`)
}

const image = await readFile('dist/image.js', 'utf8')
for (const forbidden of ['sharp', 'node:fs', 'createImageBitmap', 'OffscreenCanvas']) {
  assert.equal(image.includes(forbidden), false, `image core unexpectedly contains ${forbidden}`)
}

const browser = await readFile('dist/image/browser.js', 'utf8')
for (const forbidden of ['sharp', 'node:fs', 'node:path', 'node:url']) {
  assert.equal(
    browser.includes(forbidden),
    false,
    `browser image entry unexpectedly contains ${forbidden}`,
  )
}

const block = await readFile('dist/fonts/block.js', 'utf8')
for (const forbidden of ['threeD', 'three-d', 'slant', 'shadow']) {
  assert.equal(block.includes(forbidden), false, `block font unexpectedly contains ${forbidden}`)
}

await build({
  stdin: {
    contents:
      "import { renderText } from './dist/text.js'; import { block } from './dist/fonts/block.js'; console.log(renderText('A', { font: block }).width)",
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  platform: 'browser',
  format: 'esm',
  treeShaking: true,
  logLevel: 'silent',
})

process.stdout.write('verified side-effect boundaries and browser tree-shaking\n')
