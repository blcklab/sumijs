# SumiJS Playground

This folder contains Scriptoria `0.15.4` module Playground examples for the published `@blcklab/sumijs@0.1.9` browser ESM entry.

The examples cover:

- Built-in fonts and FIGlet-inspired layout
- Multiline text, width, alignment, wrapping, and fallback glyphs
- Solid styles, gradients, frames, and custom borders
- Plain, ANSI, secure HTML Preview, SVG source, and JSON output
- Decoded-image rendering, character ramps, thresholding, dithering, and colored ASCII
- Custom FIGlet fonts and structured error handling

Visual examples use Scriptoria's `html` output mode. SumiJS returns generated `<pre>` and `<span>` markup, Scriptoria sanitizes it, and the result is rendered inside a dedicated no-script iframe. The original result remains available in the Data tab.

```text
.scriptoria/playground.json
.scriptoria/playground/sumijs/examples/<example-id>/
├── main.js
├── controls.json   optional
└── example.json
```
