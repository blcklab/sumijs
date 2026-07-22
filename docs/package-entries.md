# Package entry points

SumiJS publishes explicit ESM and CommonJS targets with matching TypeScript declarations. Every library entry is marked side-effect free.

| Entry | Purpose | Environment |
| --- | --- | --- |
| `@blcklab/sumijs` | Convenience text/image API and all built-in fonts | Browser and Node |
| `@blcklab/sumijs/text` | Tree-shakable text core with default block font | Browser and Node |
| `@blcklab/sumijs/image` | Decoded-image renderer | Browser and Node |
| `@blcklab/sumijs/image/browser` | Fetch, bitmap, and Canvas decoder | Browser |
| `@blcklab/sumijs/image/node` | File, URL, and Sharp decoder | Node |
| `@blcklab/sumijs/fonts` | Complete built-in catalog and parser | Browser and Node |
| `@blcklab/sumijs/fonts/node` | Filesystem font loader | Node |
| `@blcklab/sumijs/fonts/block` | Block font only | Browser and Node |
| `@blcklab/sumijs/fonts/slant` | Slant font only | Browser and Node |
| `@blcklab/sumijs/fonts/shadow` | Shadow font only | Browser and Node |
| `@blcklab/sumijs/fonts/mini` | Mini font only | Browser and Node |
| `@blcklab/sumijs/fonts/three-d` | Three-dimensional font only | Browser and Node |
| `@blcklab/sumijs/formatters` | Standalone grid formatters | Browser and Node |
| `@blcklab/sumijs/types` | Public TypeScript types | TypeScript |

## ESM

```ts
import { renderText } from '@blcklab/sumijs/text'
```

## CommonJS

```js
const { renderText } = require('@blcklab/sumijs/text')
```

## Node-only boundaries

Do not import `@blcklab/sumijs/image/node` or `@blcklab/sumijs/fonts/node` into browser code. The browser entry points do not contain Node built-ins, and the core image entry does not contain either decoder.

## Build output

Each public entry is built independently as `.js`, `.cjs`, `.d.ts`, and `.d.cts`. These are intentional public targets, not shared hashed chunks. Building entries independently prevents declaration chunks and runtime chunks from changing names between releases.
