# SumiJS

A lightweight, tree-shakeable ASCII art toolkit for text, images, terminals, HTML, SVG, and JSON.

SumiJS renders source content into an immutable character grid. Render once, then reuse the result across terminal output, web interfaces, documentation assets, build pipelines, and command-line tools.

- Five independently importable built-in fonts
- FIGlet-compatible custom fonts
- Text layout, wrapping, alignment, gradients, and frames
- Browser and Node image-decoder adapters
- Plain text, ANSI, HTML, SVG, and JSON output
- ESM, CommonJS, and TypeScript declarations
- No runtime dependency for text rendering or decoded-image rendering

## Install

```bash
npm install @blcklab/sumijs
```

Install `sharp` only when decoding encoded images in Node.js:

```bash
npm install sharp
```

Node.js 20 or newer is supported.

## Text

```ts
import { renderText } from '@blcklab/sumijs'

const result = renderText('SUMI', {
  font: 'slant',
  style: {
    gradient: ['#6366f1', '#ec4899', '#f59e0b'],
  },
})

console.log(result.toANSI())
```

For a smaller browser bundle, import one font explicitly:

```ts
import { renderText } from '@blcklab/sumijs/text'
import { block } from '@blcklab/sumijs/fonts/block'

const html = renderText('SUMI', { font: block }).toHTML()
```

## Images

```ts
import { renderImage } from '@blcklab/sumijs/image'
import { createNodeImageDecoder } from '@blcklab/sumijs/image/node'

const result = await renderImage('./logo.png', {
  decoder: createNodeImageDecoder(),
  width: 64,
  charset: 'detailed',
  color: true,
})

console.log(result.toANSI())
```

Use `createBrowserImageDecoder()` from `@blcklab/sumijs/image/browser` in browser applications.

## CLI

```bash
npx @blcklab/sumijs "HELLO" --font slant
npx @blcklab/sumijs "HELLO" --format svg --out hello.svg
npx @blcklab/sumijs --image ./logo.png --width 60 --color
```

## Documentation

Start with the [complete documentation](docs/index.md).

- [Getting started](docs/getting-started.md)
- [Interactive Playground](docs/playground.md)
- [Text rendering](docs/text-rendering.md)
- [Image rendering](docs/image-rendering.md)
- [Fonts and custom fonts](docs/fonts.md)
- [Output formats](docs/output-formats.md)
- [Browser integration](docs/browser.md)
- [Node.js integration](docs/node.md)
- [Vue 3](docs/vue.md)
- [React](docs/react.md)
- [API reference](docs/api-reference.md)
- [Production checklist](docs/production-checklist.md)

## Package entry points

```text
@blcklab/sumijs
@blcklab/sumijs/text
@blcklab/sumijs/image
@blcklab/sumijs/image/browser
@blcklab/sumijs/image/node
@blcklab/sumijs/fonts
@blcklab/sumijs/fonts/node
@blcklab/sumijs/fonts/block
@blcklab/sumijs/fonts/slant
@blcklab/sumijs/fonts/shadow
@blcklab/sumijs/fonts/mini
@blcklab/sumijs/fonts/three-d
@blcklab/sumijs/formatters
@blcklab/sumijs/types
```

Every public library entry has independent ESM, CommonJS, and matching TypeScript targets. The distribution contains no hashed shared chunks.

## License

MIT
