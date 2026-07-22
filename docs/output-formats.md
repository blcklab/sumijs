# Output formats

A render operation returns a `RenderResult`. All formatter methods read the same immutable grid, so one render can be reused across terminal, browser, asset-generation, and storage workflows.

## Plain text

```ts
const text = result.toPlainText({
  preserveTrailingWhitespace: false,
  finalNewline: true,
  lineEnding: '\n',
})
```

Plain text never emits ANSI escape sequences.

## ANSI

```ts
const terminal = result.toANSI({
  colorLevel: 3,
  finalNewline: true,
})
```

Color levels:

- `0` disables color.
- `1` uses basic ANSI colors.
- `2` uses the 256-color palette.
- `3` uses truecolor RGB.

Adjacent cells with the same style are grouped to reduce redundant escape sequences.

## HTML

```ts
const html = result.toHTML({
  className: 'brand-art',
  ariaLabel: 'Brand logo',
  includePre: true,
  includeContainer: false,
  inlineStyles: true,
})
```

The default output is a `<pre class="sumi-art">` element. Set `includePre: false` when inserting the generated inner content into an existing `<pre>`.

`accessibleText` can add a visually hidden text equivalent. `containerClassName` applies to the optional outer container.

## SVG

```ts
const svg = result.toSVG({
  fontFamily: 'ui-monospace, SFMono-Regular, monospace',
  fontSize: 16,
  lineHeight: 1.2,
  letterSpacing: 0,
  background: 'transparent',
  title: 'SumiJS logo',
  description: 'The word SumiJS rendered as ASCII art',
})
```

SVG output is standalone. Use a monospaced font available in the final environment to preserve alignment.

## JSON

```ts
const data = result.toJSON()
```

The serializable structure includes version `1`, width, height, rows, style metadata, and stable source metadata. Runtime-only values are excluded.

## `toString()`

```ts
const result = renderText('SUMI', { defaultFormat: 'ansi' })
console.log(result.toString())
```

Pass a `format` option to override the result default for one call.

```ts
result.toString({ format: 'svg', svg: { title: 'SUMI' } })
```
