# Browser applications

SumiJS separates browser-safe rendering from environment-specific image decoding. Import only the entries needed by the page.

## Small text bundle

```ts
import { renderText } from 'sumijs/text'
import { block } from 'sumijs/fonts/block'

const result = renderText('CREATE', {
  font: block,
  style: {
    gradient: ['#6366f1', '#ec4899', '#f59e0b'],
  },
})

document.querySelector('#logo')!.innerHTML = result.toHTML({
  includePre: false,
  ariaLabel: 'Create',
})
```

## Browser image decoder

```ts
import { renderImage } from 'sumijs/image'
import { createBrowserImageDecoder } from 'sumijs/image/browser'

const decoder = createBrowserImageDecoder()
const result = await renderImage('/images/logo.png', {
  decoder,
  width: 70,
  color: true,
})
```

The decoder uses `fetch`, `createImageBitmap`, and Canvas APIs only when `decode()` is called. Importing the module does not read `window` or `document`, which keeps the entry safe to import during server-side rendering.

## CORS

Remote images and fonts must permit the browser origin. A CORS failure occurs before SumiJS receives usable image or font data. Serve assets from the same origin or configure the asset server appropriately.

## Content Security Policy

The HTML formatter can emit inline styles. Set `inlineStyles: false` when the site disallows inline style attributes, then style the generated classes through an approved stylesheet.

## Worker environments

The image adapter can use `OffscreenCanvas` when available. Text rendering and non-DOM formatters work in workers. Image decoding still requires `createImageBitmap` and a canvas implementation in the worker runtime.

## Rendering frequency

ASCII generation is synchronous for text and CPU-bound for images after decoding. Avoid rerendering unchanged content on every UI update. Cache the `RenderResult` or the final serialized output.
