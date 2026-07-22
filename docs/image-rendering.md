# Image rendering

`renderImage()` samples a decoded image into an ASCII grid. Encoded inputs require an adapter because browser and Node environments decode images differently.

## Render decoded pixel data

No optional dependency is required when the input is already RGBA pixel data.

```ts
import { renderImage } from '@blcklab/sumijs/image'

const result = await renderImage(
  {
    width: 2,
    height: 1,
    data: new Uint8ClampedArray([0, 0, 0, 255, 255, 255, 255, 255]),
  },
  {
    width: 2,
    height: 1,
    characters: ' .#',
  },
)
```

## Encoded images

Use the browser adapter for browser URLs, blobs, and byte data:

```ts
import { renderImage } from '@blcklab/sumijs/image'
import { createBrowserImageDecoder } from '@blcklab/sumijs/image/browser'

const result = await renderImage('/logo.png', {
  decoder: createBrowserImageDecoder(),
  width: 72,
})
```

Use the Node adapter for file paths, URLs, buffers, and byte data:

```ts
import { renderImage } from '@blcklab/sumijs/image'
import { createNodeImageDecoder } from '@blcklab/sumijs/image/node'

const result = await renderImage('./logo.png', {
  decoder: createNodeImageDecoder(),
  width: 72,
})
```

The Node adapter dynamically imports the optional `sharp` dependency only when decoding begins.

## Dimensions and aspect ratio

When neither dimension is specified, output width defaults to the smaller of 80 columns or the source width. With `preserveAspectRatio: true`, SumiJS calculates the missing dimension.

```ts
await renderImage(input, {
  width: 80,
  preserveAspectRatio: true,
  cellRatio: 0.5,
})
```

`cellRatio` compensates for terminal characters being taller than they are wide. Adjust it for the font and destination where the art is displayed.

## Character ramps

Built-in ramps:

- `minimal`
- `standard`
- `detailed`
- `blocks`
- `binary`

```ts
await renderImage(input, {
  charset: 'detailed',
})
```

Use a custom ramp with `characters`. Characters should be ordered from visually light to visually dense.

```ts
await renderImage(input, {
  characters: ' .:-=+*#%@',
})
```

## Sampling

- `average` samples the source area represented by each output cell and is the default.
- `nearest` selects the closest source pixel and preserves hard pixel edges.

## Tone controls

```ts
await renderImage(input, {
  invert: false,
  grayscale: false,
  contrast: 1.1,
  brightness: 0,
  gamma: 1,
  threshold: 0.5,
  dither: true,
})
```

`brightness` accepts values from `-1` to `1`. `threshold` accepts values from `0` to `1`. Contrast must be non-negative, and gamma must be greater than zero.

## Color and transparency

```ts
await renderImage(input, {
  color: true,
  background: '#0b1020',
  alphaThreshold: 8,
  transparentCharacter: ' ',
})
```

When color is enabled, sampled source colors become cell foreground colors. Pixels at or below `alphaThreshold` use `transparentCharacter`.

## Safety limits

Defaults are applied before output-grid allocation:

```ts
limits: {
  maxSourcePixels: 40_000_000,
  maxOutputWidth: 2_000,
  maxOutputHeight: 2_000,
  maxOutputCells: 1_000_000,
}
```

Keep these limits for untrusted input. Lower them for APIs with stricter memory budgets. See [Security](security.md) and [Performance](performance.md).
