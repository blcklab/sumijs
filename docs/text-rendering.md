# Text rendering

`renderText()` converts a string into a rectangular immutable grid. It supports multiline input, independent fonts, FIGlet-inspired layout modes, width constraints, frames, and style metadata.

## Convenience and tree-shakable APIs

Use the root entry when selecting built-in fonts by name:

```ts
import { renderText } from '@blcklab/sumijs'

const result = renderText('HELLO', { font: 'shadow' })
```

Use explicit imports when bundle size is the priority:

```ts
import { renderText } from '@blcklab/sumijs/text'
import { shadow } from '@blcklab/sumijs/fonts/shadow'

const result = renderText('HELLO', { font: shadow })
```

## Multiline text

Every input line is rendered as a separate banner line. `lineSpacing` inserts blank rows between them.

```ts
const result = renderText('BUILD\nSHIP', {
  font: 'block',
  lineSpacing: 1,
})
```

Windows and classic Mac line endings are normalized before rendering.

## Layout modes

```ts
renderText('AV', { layout: 'full' })
renderText('AV', { layout: 'fitted' })
renderText('AV', { layout: 'smushed' })
```

- `full` retains a complete separator between adjacent glyphs.
- `fitted` overlaps surrounding blank columns without allowing ink collisions.
- `smushed` applies collision-aware FIGlet-inspired rules for denser headings.

A font may define its preferred horizontal layout. An explicit `layout` option overrides it.

## Letter and line spacing

```ts
renderText('SUMI', {
  letterSpacing: 1,
  lineSpacing: 1,
})
```

Both values must be non-negative integers.

## Width and alignment

```ts
renderText('SUMI', {
  width: 80,
  align: 'center',
  overflow: 'clip',
})
```

`width` creates an exact output width. `maxWidth` applies a maximum only when the rendered grid is wider. Alignment can be `left`, `center`, or `right`.

Overflow modes:

- `preserve` keeps content wider than the requested width.
- `clip` trims content to the width.
- `wrap` wraps the original words before glyph rendering.

Wrapping never cuts a glyph into arbitrary pieces. A single word that cannot fit produces an `INVALID_OPTIONS` error.

## Fallback characters

When a font does not contain an input grapheme, SumiJS tries its uppercase form and then uses `fallbackCharacter`.

```ts
renderText('A🌙B', {
  fallbackCharacter: '?',
})
```

`Intl.Segmenter` is used when available so surrogate pairs and combined graphemes are not split incorrectly.

## Trimming

By default, blank outer rows and trailing row whitespace are trimmed. Preserve the full font canvas with:

```ts
renderText('SUMI', { trim: false })
```

## Default output format

`defaultFormat` controls what `result.toString()` returns. Explicit formatter methods are unaffected.

```ts
const result = renderText('SUMI', { defaultFormat: 'svg' })
const svg = result.toString()
```

See [Frames and layout](frames-and-layout.md), [Styling](styling.md), and [Output formats](output-formats.md).
