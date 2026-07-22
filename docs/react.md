# React integration

Memoize ASCII generation from the values that actually affect the output.

## Text component

```tsx
import { useMemo } from 'react'
import { renderText } from '@blcklab/sumijs/text'
import { block } from '@blcklab/sumijs/fonts/block'

export function AsciiHeading({ text }: { text: string }) {
  const html = useMemo(
    () =>
      renderText(text, {
        font: block,
        style: { color: '#8b5cf6' },
      }).toHTML({ includePre: false, ariaLabel: text }),
    [text],
  )

  return (
    <pre className="ascii-heading" aria-label={text} dangerouslySetInnerHTML={{ __html: html }} />
  )
}
```

SumiJS escapes its generated HTML. Keep the returned string isolated from unrelated untrusted markup.

## Server rendering

Text rendering and HTML/SVG formatting are safe to call in server components because they do not require browser globals.

## Client-side images

Use an effect for browser decoding and cancel stale updates when the source changes.

```tsx
useEffect(() => {
  let active = true

  async function load() {
    const result = await renderImage(src, {
      decoder: createBrowserImageDecoder(),
      width: 64,
    })
    if (active) setHtml(result.toHTML({ includePre: false, ariaLabel: alt }))
  }

  void load()
  return () => {
    active = false
  }
}, [src, alt])
```

For repeated assets, cache the serialized result above the component layer rather than decoding the same file for every mount.
