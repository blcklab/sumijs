# Package entry points

SumiJS publishes explicit ESM and CommonJS targets with matching TypeScript declarations. Every library entry is marked side-effect free.

| Entry                  | Purpose                                           | Environment      |
| ---------------------- | ------------------------------------------------- | ---------------- |
| `sumijs`               | Convenience text/image API and all built-in fonts | Browser and Node |
| `sumijs/text`          | Tree-shakable text core with default block font   | Browser and Node |
| `sumijs/image`         | Decoded-image renderer                            | Browser and Node |
| `sumijs/image/browser` | Fetch, bitmap, and Canvas decoder                 | Browser          |
| `sumijs/image/node`    | File, URL, and Sharp decoder                      | Node             |
| `sumijs/fonts`         | Complete built-in catalog and parser              | Browser and Node |
| `sumijs/fonts/node`    | Filesystem font loader                            | Node             |
| `sumijs/fonts/block`   | Block font only                                   | Browser and Node |
| `sumijs/fonts/slant`   | Slant font only                                   | Browser and Node |
| `sumijs/fonts/shadow`  | Shadow font only                                  | Browser and Node |
| `sumijs/fonts/mini`    | Mini font only                                    | Browser and Node |
| `sumijs/fonts/three-d` | Three-dimensional font only                       | Browser and Node |
| `sumijs/formatters`    | Standalone grid formatters                        | Browser and Node |
| `sumijs/types`         | Public TypeScript types                           | TypeScript       |

## ESM

```ts
import { renderText } from 'sumijs/text'
```

## CommonJS

```js
const { renderText } = require('sumijs/text')
```

## Node-only boundaries

Do not import `sumijs/image/node` or `sumijs/fonts/node` into browser code. The browser entry points do not contain Node built-ins, and the core image entry does not contain either decoder.

## Build output

Each public entry is built independently as `.js`, `.cjs`, `.d.ts`, and `.d.cts`. These are intentional public targets, not shared hashed chunks. Building entries independently prevents declaration chunks and runtime chunks from changing names between releases.
