# SumiJS Playground

This folder contains Scriptoria `0.15` module Playground examples for the published `@blcklab/sumijs@0.1.0` browser ESM entry.

The examples cover:

- Built-in fonts and FIGlet-inspired layout
- Multiline text, width, alignment, wrapping, and fallback glyphs
- Gradients, frames, and custom borders
- Plain, ANSI, HTML, SVG, and JSON output
- Decoded-image rendering, character ramps, thresholding, dithering, and color metadata
- Custom FIGlet fonts and structured error handling

Each example returns structured-cloneable data. ASCII previews are returned as arrays of lines so Scriptoria displays them in its monospace JSON result panel without losing alignment.

```text
.scriptoria/playground.json
.scriptoria/playground/sumijs/examples/<example-id>/
├── main.js
├── controls.json   optional
└── example.json
```
