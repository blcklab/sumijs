# Troubleshooting

## `IMAGE_DECODER_REQUIRED`

Encoded image input needs an environment adapter.

Browser:

```ts
import { createBrowserImageDecoder } from 'sumijs/image/browser'
```

Node:

```ts
import { createNodeImageDecoder } from 'sumijs/image/node'
```

Install `sharp` for the Node adapter.

## Sharp cannot be loaded

Confirm that `sharp` is installed in the application, not only globally:

```bash
npm install sharp
```

Use a Sharp version compatible with the deployment runtime and platform. Reinstall dependencies on the target platform rather than copying native binaries from a different operating system.

## Browser image request fails

Verify the image URL, HTTP status, CORS response headers, and Content Security Policy. The decoder cannot bypass browser network policy.

## Canvas APIs are unavailable

The browser decoder requires `createImageBitmap` and a 2D canvas. Decode the image through another adapter and pass `DecodedImage` data, or run the operation in a supported browser environment.

## Banner is clipped

Increase `width`, remove the exact width, select `overflow: 'preserve'`, use a smaller font, or wrap at word boundaries with `overflow: 'wrap'`.

## A wrapped word does not fit

Wrapping never splits a rendered word across glyph columns. Increase the width, shorten the word, reduce letter spacing, or use the `mini` font.

## HTML alignment looks wrong

Use a monospaced font and preserve whitespace.

```css
.sumi-art {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  white-space: pre;
  line-height: 1;
}
```

## SVG alignment differs across systems

Specify a monospaced `fontFamily` available where the SVG is rendered. For pixel-identical assets, generate and review SVG in the same build environment and ship the approved output.

## CommonJS or TypeScript resolution fails

Import only documented package subpaths and use a current NodeNext or bundler-aware TypeScript resolution mode. Remove stale build caches after upgrading.

## CLI refuses to write a file

The output already exists. Review the path and add `--force` only when replacement is intended. Add `--mkdir` when parent folders need to be created.
