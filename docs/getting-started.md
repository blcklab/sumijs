# Getting started

## Requirements

SumiJS supports Node.js 20 or newer. Browser entry points target modern evergreen browsers. The text renderer, formatters, built-in fonts, and decoded-image renderer have no runtime dependencies.

Node image decoding uses the optional `sharp` package. Install it only in applications that decode PNG, JPEG, WebP, AVIF, GIF, TIFF, or other encoded image files on the server.

## Install

```bash
npm install sumijs
```

For Node image decoding:

```bash
npm install sumijs sharp
```

## Render text

The root entry is the most convenient API. It includes the built-in font registry, allowing fonts to be selected by name.

```ts
import { renderText } from 'sumijs'

const result = renderText('SUMI', {
  font: 'slant',
  layout: 'fitted',
})

console.log(result.toPlainText())
```

For the smallest browser bundle, import the text core and one font explicitly:

```ts
import { renderText } from 'sumijs/text'
import { block } from 'sumijs/fonts/block'

const result = renderText('SUMI', { font: block })
```

The specialized `sumijs/text` entry accepts the default `block` string or a `SumiFont` object. Import additional fonts through their dedicated subpaths.

## Display HTML

```ts
const target = document.querySelector<HTMLElement>('#ascii-logo')

if (target) {
  target.innerHTML = result.toHTML({
    includePre: false,
    ariaLabel: 'SumiJS',
  })
}
```

SumiJS escapes generated HTML content and validates supported color values. See [Security](security.md) for trust-boundary guidance.

## Render an image in Node.js

```ts
import { renderImage } from 'sumijs/image'
import { createNodeImageDecoder } from 'sumijs/image/node'

const result = await renderImage('./logo.png', {
  decoder: createNodeImageDecoder(),
  width: 72,
  charset: 'detailed',
  color: true,
})

console.log(result.toANSI())
```

## Use the command line

```bash
npx sumijs "HELLO" --font slant
npx sumijs "HELLO" --format svg --out hello.svg
npx sumijs --image ./logo.png --width 60 --color
```

Continue with [Text rendering](text-rendering.md), [Image rendering](image-rendering.md), or the [CLI guide](cli.md).
