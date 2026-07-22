# Compatibility and versioning

## Runtime support

- Node.js 20 or newer.
- Modern evergreen browsers for text, formatting, and decoded-image rendering.
- Browser image decoding requires `fetch`, `createImageBitmap`, and Canvas or `OffscreenCanvas` support.
- Node image decoding requires the optional `sharp` peer dependency.

## Modules

SumiJS publishes ESM and CommonJS library targets. TypeScript declarations are provided separately for both module systems so NodeNext and bundler resolution can select the matching type format.

## Semantic versioning

SumiJS follows semantic versioning:

- Patch releases fix behavior without intentionally changing supported public APIs.
- Minor releases add backward-compatible capabilities.
- Major releases may remove or change public APIs.

During `0.x`, incompatible changes may be released in a minor version. Read the changelog before upgrading between minor versions until `1.0.0`.

## Stable surfaces

Public support is limited to entry points declared in `package.json`. Files inside `dist` that are not reachable through an export map are implementation details. Do not import source paths or construct internal distribution paths.

## Locking versions

Applications that require deterministic output should use a lockfile and update SumiJS deliberately. Font glyph data, layout corrections, and formatter fixes can alter serialized output even when API signatures remain compatible.
