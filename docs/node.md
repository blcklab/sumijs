# Node.js applications

SumiJS supports Node.js 20 or newer and provides isolated adapters for filesystem fonts and encoded images.

## Text generation

```ts
import { writeFile } from 'node:fs/promises'
import { renderText } from 'sumijs'

const svg = renderText('RELEASE', {
  font: 'shadow',
  style: { color: '#8b5cf6' },
}).toSVG({ title: 'Release' })

await writeFile('release.svg', svg)
```

## Encoded image decoding

```ts
import { renderImage } from 'sumijs/image'
import { createNodeImageDecoder } from 'sumijs/image/node'

const decoder = createNodeImageDecoder()
const result = await renderImage('./avatar.webp', {
  decoder,
  width: 64,
  color: true,
})
```

Install `sharp` in the application:

```bash
npm install sharp
```

The decoder accepts local paths, HTTP and HTTPS URLs, `Buffer`, `Uint8Array`, `ArrayBuffer`, and `Blob`. Remote requests use the Node global `fetch` implementation.

## Custom font files

```ts
import { loadFontFromFile } from 'sumijs/fonts/node'
import { renderText } from 'sumijs/text'

const font = await loadFontFromFile('./assets/brand.flf')
const output = renderText('BRAND', { font }).toPlainText()
```

## Server requests

Retain output limits for user-supplied images. Apply application-level request size, URL allowlist, timeout, and concurrency controls before calling a decoder.

## CommonJS

Every library entry has a CommonJS target:

```js
const { renderText } = require('sumijs')
const { block } = require('sumijs/fonts/block')

console.log(renderText('CJS', { font: block }).toPlainText())
```

The CLI remains an ESM executable and can be launched normally through `npx sumijs` or a package script.
