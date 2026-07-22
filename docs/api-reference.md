# API reference

## `renderText(input, options?)`

Available from `sumijs` and `sumijs/text`.

```ts
function renderText(input: string, options?: RenderTextOptions): RenderResult
```

The root entry accepts built-in font names or a `SumiFont`. The specialized text entry accepts `block` or a `SumiFont`.

`RenderTextOptions`:

| Option              | Type                        | Default           |
| ------------------- | --------------------------- | ----------------- |
| `font`              | built-in name or `SumiFont` | `block`           |
| `layout`            | `full`, `fitted`, `smushed` | font preference   |
| `align`             | `left`, `center`, `right`   | `left`            |
| `width`             | non-negative integer        | rendered width    |
| `maxWidth`          | non-negative integer        | none              |
| `overflow`          | `preserve`, `clip`, `wrap`  | context-dependent |
| `lineSpacing`       | non-negative integer        | `0`               |
| `letterSpacing`     | non-negative integer        | `0`               |
| `fallbackCharacter` | string                      | `?`               |
| `trim`              | boolean                     | `true`            |
| `style`             | `StyleOptions`              | none              |
| `frame`             | `FrameOptions` or `false`   | none              |
| `defaultFormat`     | output format               | `plain`           |

## `renderImage(input, options?)`

Available from `sumijs` and `sumijs/image`.

```ts
function renderImage(input: ImageInput, options?: RenderImageOptions): Promise<RenderResult>
```

Important options:

| Option                 | Type                        | Default                    |
| ---------------------- | --------------------------- | -------------------------- |
| `decoder`              | `ImageDecoder`              | required for encoded input |
| `width`                | positive number             | up to 80/source width      |
| `height`               | positive number             | derived                    |
| `preserveAspectRatio`  | boolean                     | `true`                     |
| `cellRatio`            | positive number             | `0.5`                      |
| `charset`              | built-in character-set name | `standard`                 |
| `characters`           | string                      | selected character set     |
| `sampling`             | `average` or `nearest`      | `average`                  |
| `invert`               | boolean                     | `false`                    |
| `grayscale`            | boolean                     | `false`                    |
| `color`                | boolean                     | `false`                    |
| `background`           | color                       | black                      |
| `transparentCharacter` | string                      | space                      |
| `alphaThreshold`       | number from 0 to 255        | `0`                        |
| `contrast`             | non-negative number         | `1`                        |
| `brightness`           | number from -1 to 1         | `0`                        |
| `gamma`                | positive number             | `1`                        |
| `threshold`            | number from 0 to 1          | none                       |
| `dither`               | boolean                     | `false`                    |
| `luminance`            | custom function             | relative luminance         |
| `style`                | `StyleOptions`              | none                       |
| `frame`                | `FrameOptions` or `false`   | none                       |
| `align`                | text alignment              | `left`                     |
| `outputWidth`          | number                      | rendered width             |
| `limits`               | `ImageSafetyLimits`         | safe defaults              |

## Image decoders

```ts
createBrowserImageDecoder(options?): ImageDecoder
createNodeImageDecoder(): ImageDecoder
```

Browser options support a custom `fetch` implementation and `requestInit`. Browser CORS policy still applies to remote requests.

## Font APIs

```ts
parseFont(source: string, name?: string): SumiFont
loadFontFromURL(url: string | URL, options?): Promise<SumiFont>
loadFontFromFile(path: string, name?: string): Promise<SumiFont>
listFonts(): BuiltInFontName[]
getBuiltInFont(name: BuiltInFontName): SumiFont
```

Built-in exports are `block`, `slant`, `shadow`, `mini`, and `threeD`.

## `RenderResult`

```ts
interface RenderResult {
  readonly grid: AsciiGrid
  readonly width: number
  readonly height: number
  toString(options?: StringFormatOptions): string
  toPlainText(options?: PlainTextOptions): string
  toANSI(options?: ANSIFormatOptions): string
  toHTML(options?: HTMLFormatOptions): string
  toSVG(options?: SVGFormatOptions): string
  toJSON(): SerializableAsciiGrid
}
```

## Standalone formatters

Available from `sumijs/formatters`:

```ts
formatPlain(grid, options?)
formatANSI(grid, options?)
formatHTML(grid, options?)
formatSVG(grid, options?)
formatJSON(grid)
```

Use these when an application already owns an `AsciiGrid`.

## `StyleOptions`

```ts
interface StyleOptions {
  readonly color?: ColorInput
  readonly backgroundColor?: ColorInput
  readonly gradient?: readonly [ColorInput, ColorInput, ...ColorInput[]]
  readonly gradientDirection?: 'horizontal' | 'vertical' | 'diagonal'
  readonly gradientWhitespace?: boolean
  readonly bold?: boolean
  readonly dim?: boolean
  readonly italic?: boolean
  readonly underline?: boolean
}
```

## `FrameOptions`

```ts
interface FrameOptions {
  readonly style?: 'single' | 'double' | 'rounded' | 'heavy' | CustomBorderCharacters
  readonly padding?: number | BoxSpacing
  readonly margin?: number | BoxSpacing
  readonly title?: string
  readonly titleAlign?: 'left' | 'center' | 'right'
}
```

## Public types

All public types can be imported from `sumijs/types` with `import type`. The root and specialized entries also re-export types relevant to their APIs.
