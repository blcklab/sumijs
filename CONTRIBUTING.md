# Contributing to SumiJS

Thank you for improving SumiJS.

## Before opening a change

Use an issue for behavior changes that affect public APIs, output compatibility, security boundaries, or package entry points. Small fixes can proceed directly through a focused pull request.

## Local setup

```bash
npm ci
npm run check
```

Node.js 20 and 22 are tested in CI.

## Pull requests

- Keep runtime dependencies out of the text and decoded-image core.
- Preserve browser and Node adapter boundaries.
- Add tests for behavior changes and regressions.
- Update `/docs` for public behavior changes.
- Do not import internal `src` or `dist` paths in public examples.
- Keep generated output out of commits unless it is an intentional fixture.

The full release gate must pass before merge.
