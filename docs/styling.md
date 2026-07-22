# Styling

Text and image results use the same cell styling system. Styles are stored in the immutable grid and can be rendered by ANSI, HTML, SVG, or JSON formatters.

## Solid colors

```ts
const result = renderText('SUMI', {
  style: {
    color: '#8b5cf6',
    backgroundColor: '#0b1020',
    bold: true,
  },
})
```

Supported colors include selected named colors, `#rgb`, `#rrggbb`, `rgb(r,g,b)`, and RGB objects.

```ts
style: {
  color: { red: 124, green: 58, blue: 237 },
}
```

Unsupported or malformed colors produce `INVALID_OPTIONS` rather than being inserted into generated CSS.

## Gradients

```ts
const result = renderText('SUMI', {
  style: {
    gradient: ['#6366f1', '#ec4899', '#f59e0b'],
    gradientDirection: 'horizontal',
  },
})
```

Directions are `horizontal`, `vertical`, and `diagonal`. The gradient spans the full rectangular grid, so colors remain continuous across rows.

Whitespace remains uncolored by default. Enable `gradientWhitespace` when the background or destination requires every cell to carry the interpolated foreground color.

## Text attributes

```ts
style: {
  bold: true,
  dim: false,
  italic: false,
  underline: false,
}
```

Terminal support varies. HTML and SVG preserve the supported visual metadata using generated markup and styles.

## Image color and global style

`renderImage({ color: true })` derives a foreground color from each sampled pixel. A global style is applied afterward, so an explicit `style.color` can intentionally override sampled colors.

## Formatter behavior

- Plain text ignores style metadata.
- ANSI emits the requested terminal color level.
- HTML emits escaped spans and optional inline styles.
- SVG emits styled text runs.
- JSON serializes stable style fields.

See [Output formats](output-formats.md).
