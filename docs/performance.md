# Performance

SumiJS is designed around explicit entry points, immutable results, and one-time rendering.

## Import only what is needed

For a single browser font:

```ts
import { renderText } from '@blcklab/sumijs/text'
import { block } from '@blcklab/sumijs/fonts/block'
```

The root entry includes all built-in fonts for convenience. Use it for CLI-like experiences and font selectors, not when one font is known at build time.

## Reuse results

```ts
const result = renderText('SUMI', options)
const terminal = result.toANSI()
const html = result.toHTML()
const svg = result.toSVG()
```

Formatter calls do not rerender the input. Keep the result when multiple outputs are needed.

## Cache fonts

Parse or load a custom font once. Reuse the immutable `SumiFont` object for every render.

## Control image dimensions

Image rendering work grows with output cells and the sampling area. Render close to the dimensions actually displayed. A 70-column terminal preview should not first create a 1,000-column grid.

For user traffic, combine SumiJS limits with application-level concurrency control. Large decode operations can consume memory even when final output limits are small.

## Browser rendering

Move repeated image conversion away from high-frequency UI updates. Cache by source URL and rendering options. A worker can keep CPU-heavy sampling away from the main thread when the browser environment supplies the required bitmap and canvas APIs.

## Measurement

Performance depends on font, text length, image dimensions, decoder, runtime, and hardware. Measure the exact production path. The repository benchmark is informational and does not define a cross-machine guarantee.
