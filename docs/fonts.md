# Fonts

SumiJS ships five built-in fonts as independent modules.

| Font name | Export   | Entry point                     | Typical use                |
| --------- | -------- | ------------------------------- | -------------------------- |
| `block`   | `block`  | `@blcklab/sumijs/fonts/block`   | General headings and logos |
| `slant`   | `slant`  | `@blcklab/sumijs/fonts/slant`   | Dynamic headings           |
| `shadow`  | `shadow` | `@blcklab/sumijs/fonts/shadow`  | Dimensional titles         |
| `mini`    | `mini`   | `@blcklab/sumijs/fonts/mini`    | Compact labels             |
| `three-d` | `threeD` | `@blcklab/sumijs/fonts/three-d` | Decorative banners         |

## Import one font

```ts
import { renderText } from '@blcklab/sumijs/text'
import { mini } from '@blcklab/sumijs/fonts/mini'

const result = renderText('DOCS', { font: mini })
```

This is the recommended pattern for browser applications because unused fonts never enter the module graph.

## Import the complete font catalog

```ts
import {
  block,
  builtInFonts,
  getBuiltInFont,
  listFonts,
  mini,
  shadow,
  slant,
  threeD,
} from '@blcklab/sumijs/fonts'
```

The aggregate entry is useful for font pickers, interactive playgrounds, and CLI-like interfaces.

```ts
for (const name of listFonts()) {
  const font = getBuiltInFont(name)
  console.log(renderText(name, { font }).toPlainText())
}
```

`getBuiltInFont()` throws `UNKNOWN_FONT` for an unsupported name.

## Font object shape

A `SumiFont` contains a name, height, optional baseline and hardblank metadata, a preferred layout, and a glyph map.

```ts
interface SumiFont {
  readonly name: string
  readonly height: number
  readonly baseline?: number
  readonly hardblank?: string
  readonly horizontalLayout?: 'full' | 'fitted' | 'smushed'
  readonly glyphs: Readonly<Record<string, readonly string[]>>
}
```

Every glyph must contain the same number of rows as the font height. Use [Custom FIGlet fonts](custom-fonts.md) when loading external `.flf` files.
