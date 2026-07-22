# Publishing SumiJS

This file is for repository maintainers. Product usage belongs in `/docs`.

The public npm package is `@blcklab/sumijs`; the CLI executable remains `sumijs`.

## Release requirements

- Use Node.js 20 or 22.
- Keep `package-lock.json` committed.
- Confirm the changelog describes user-visible changes.
- Run `npm ci` from a clean checkout.
- Run `npm run check`.
- Inspect `npm pack --dry-run`.

## Publish through GitHub Actions

1. Update the version in `package.json`.
2. Update `CHANGELOG.md`.
3. Merge the release commit into the default branch.
4. Create and push a tag that exactly matches `v<package version>`.

Example:

```bash
git tag v0.1.0
git push origin v0.1.0
```

The publish workflow verifies the tag, runs the complete release gate, and publishes with npm provenance.

## Required repository configuration

- Add `NPM_TOKEN` as an environment secret.
- Create the `npm` GitHub environment if environment protection is desired.
- Grant the workflow `id-token: write` for provenance.

Never publish by bypassing a failing release check.
