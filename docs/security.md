# Security

SumiJS treats rendering and decoding as separate trust boundaries. The library validates its own generated markup and dimensions, while the application controls which sources may be loaded.

## HTML and SVG output

Text and attribute values are escaped before HTML or SVG serialization. Supported colors are parsed through a strict grammar before they are written into styles. SumiJS does not use `eval`, `Function`, script injection, or dynamic code generation.

Do not combine a generated string with unrelated untrusted HTML before inserting it into the document.

## Remote URLs

Font and image loaders perform a request only when explicitly called. The application remains responsible for deciding which URLs are allowed.

For server applications:

- Restrict protocols to HTTP and HTTPS when remote loading is enabled.
- Reject private-network and metadata-service destinations when accepting user URLs.
- Apply request timeouts, response-size limits, and redirect limits.
- Avoid forwarding application credentials to untrusted origins.

SumiJS does not implement a network allowlist because deployment trust policies differ.

## Image resource limits

`renderImage()` validates source pixels, width, height, and total output cells before allocating the output grid. Keep the defaults or configure lower limits for public APIs.

Decoders may allocate memory before SumiJS receives decoded pixels. Apply upload and request limits before passing encoded data to `sharp` or browser image APIs.

## Custom fonts

Malformed fonts are rejected with `MALFORMED_FONT`. A valid font can still be large, so limit downloaded font size before parsing user-controlled data.

## Terminal output

ANSI sequences are generated from validated style metadata. Plain-text output never includes generated ANSI styling. User input is rendered through font glyphs rather than copied into terminal control sequences.

## Reporting vulnerabilities

Follow the private reporting instructions in the repository `SECURITY.md` rather than opening a public issue with exploit details.
