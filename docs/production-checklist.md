# Production checklist

Use this checklist before deploying an application that renders untrusted or frequently changing input.

## Package and imports

- Commit the application lockfile.
- Import dedicated font and environment entry points.
- Keep Node-only adapters out of browser bundles.
- Install `sharp` only where Node image decoding is used.

## Output

- Provide accessible text for meaningful ASCII art.
- Use a monospaced font for HTML and SVG display.
- Confirm terminal color output on light and dark themes.
- Cache deterministic output when the same input is rendered repeatedly.

## Images

- Keep source and output safety limits enabled.
- Apply upload limits before decoding.
- Restrict remote image URLs in server applications.
- Add network timeouts and concurrency limits around remote decoding.
- Render close to the final display dimensions.

## Browser security

- Review Content Security Policy requirements.
- Set `inlineStyles: false` when inline styles are prohibited.
- Do not concatenate generated output with unrelated untrusted HTML.
- Configure CORS for remote fonts and images.

## Operations

- Handle `SumiError.code` instead of matching full messages.
- Log decoding and output-limit failures with request context that does not expose secrets.
- Test SSR and hydration with the production package version.
- Verify CLI exit codes in build pipelines.
