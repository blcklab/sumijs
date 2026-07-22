# Interactive Playground

The SumiJS Playground runs the published browser ESM build inside Scriptoria's sandboxed module adapter. It uses `@blcklab/sumijs@0.1.0` from jsDelivr and does not require Node.js, Sharp, a backend, or an image-decoding dependency.

Open the dedicated Playground from the repository's **Playground** navigation item. Saved examples are grouped into Getting Started, Text Layout, Styling & Frames, Output & Serialization, Image Rendering, and Advanced topics.

## What the examples cover

### Getting Started

- **Basic Banner** — render text with a selectable font and layout.
- **Font Gallery** — compare all five built-in fonts.
- **Multiline Banner** — render multiple banner lines with configurable spacing.

### Text Layout

- **Layout Modes** — compare full, fitted, and smushed glyph composition.
- **Width & Alignment** — apply an exact width, wrapping, clipping, and alignment.
- **Letter & Line Spacing** — tune horizontal and vertical spacing.
- **Fallback Characters** — replace unsupported graphemes safely.

### Styling & Frames

- **Gradient Styling** — attach validated foreground gradients and generate HTML.
- **Frame Builder** — choose a built-in frame, padding, title, and title alignment.
- **Custom Border** — define all eight border characters.

### Output & Serialization

- **Output Formats** — reuse one immutable result as plain text, ANSI, HTML, SVG, and JSON.
- **Serializable Grid** — inspect the complete stable version-1 JSON grid.

### Image Rendering

- **Grayscale Image** — render decoded RGBA data without an environment adapter.
- **Character Sets** — compare all built-in image ramps.
- **Threshold & Dithering** — create binary ASCII from a radial luminance field.
- **Color Image Metadata** — preserve sampled RGB colors in cells and generated HTML.

### Advanced

- **Custom FIGlet Font** — construct and parse a valid custom `.flf` source.
- **Error Handling** — catch `SumiError` and use stable error codes.

## Inline Playground snippets

Inline snippets contain only the body of Scriptoria's generated `run({ module, inputs })` function.

### Render a banner

```javascript playground
const result = module.renderText('SUMI', {
  font: 'slant',
  layout: 'fitted',
})

return {
  preview: result.toPlainText().split('\n'),
  width: result.width,
  height: result.height,
}
```

### Add a rounded frame

```javascript playground
const result = module.renderText('INK', {
  font: 'mini',
  frame: {
    style: 'rounded',
    padding: 1,
    title: 'SumiJS',
    titleAlign: 'center',
  },
})

return {
  preview: result.toPlainText().split('\n'),
}
```

### Render decoded image data

```javascript playground
const width = 24
const height = 6
const data = new Uint8ClampedArray(width * height * 4)

for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const offset = (y * width + x) * 4
    const value = Math.round((x / (width - 1)) * 255)
    data[offset] = value
    data[offset + 1] = value
    data[offset + 2] = value
    data[offset + 3] = 255
  }
}

const result = await module.renderImage(
  { width, height, data },
  {
    width,
    height,
    preserveAspectRatio: false,
    charset: 'detailed',
  },
)

return {
  preview: result.toPlainText().split('\n'),
}
```

### Inspect available fonts

```javascript playground
return {
  fonts: module.listFonts(),
}
```

## Playground result shape

Scriptoria transfers module results through `postMessage`, so examples return structured-cloneable values. ASCII previews use arrays of strings rather than a single newline-containing string. This keeps each row visible and aligned in the JSON result panel.

The examples intentionally avoid:

- Node.js built-ins
- File-system access
- The optional Sharp decoder
- Arbitrary remote imports
- Parent-page DOM access
- Non-transferable render-result instances
