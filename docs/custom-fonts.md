# Custom FIGlet fonts

SumiJS can parse FIGlet-compatible `.flf` content at runtime. Keep font loading separate from rendering so the same parsed font can be reused.

## Parse a string

```ts
import { parseFont } from '@blcklab/sumijs/fonts'
import { renderText } from '@blcklab/sumijs/text'

const font = parseFont(fontSource, 'brand')
const result = renderText('BRAND', { font })
```

The parser reads the standard ASCII glyph range from code point 32 through 126. It validates the FIGlet header, height, comment count, glyph rows, and end markers.

## Load in a browser

```ts
import { loadFontFromURL } from '@blcklab/sumijs/fonts'

const font = await loadFontFromURL('/fonts/brand.flf', {
  name: 'brand',
})
```

A custom `fetch` implementation can be supplied:

```ts
const font = await loadFontFromURL(fontUrl, {
  fetch: authenticatedFetch,
  name: 'private-brand',
})
```

The URL is requested only when `loadFontFromURL()` is called. Browser CORS rules still apply.

## Load from Node.js

```ts
import { loadFontFromFile } from '@blcklab/sumijs/fonts/node'

const font = await loadFontFromFile('./assets/brand.flf', 'brand')
```

The Node loader is isolated in `@blcklab/sumijs/fonts/node`, so browser bundles do not include filesystem imports.

## Cache parsed fonts

Parsing is deterministic. Parse once at startup or build time and reuse the returned immutable font object.

```ts
const fonts = new Map<string, SumiFont>()
fonts.set('brand', await loadFontFromURL('/fonts/brand.flf'))
```

## Error handling

Invalid font data throws `SumiError` with code `MALFORMED_FONT`. Network failures are also reported as `MALFORMED_FONT` with the HTTP status in the message. See [Errors](errors.md).
