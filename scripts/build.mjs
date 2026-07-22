import { chmod, rm } from 'node:fs/promises'
import { build } from 'tsup'

const entries = [
  ['src/index.ts', 'dist'],
  ['src/text.ts', 'dist'],
  ['src/image.ts', 'dist'],
  ['src/formatters.ts', 'dist'],
  ['src/types.ts', 'dist'],
  ['src/image/browser.ts', 'dist/image'],
  ['src/image/node.ts', 'dist/image'],
  ['src/fonts/index.ts', 'dist/fonts'],
  ['src/fonts/node.ts', 'dist/fonts'],
  ['src/fonts/block.ts', 'dist/fonts'],
  ['src/fonts/slant.ts', 'dist/fonts'],
  ['src/fonts/shadow.ts', 'dist/fonts'],
  ['src/fonts/mini.ts', 'dist/fonts'],
  ['src/fonts/three-d.ts', 'dist/fonts'],
]

await rm('dist', { recursive: true, force: true })

for (const [entry, outDir] of entries) {
  await build({
    entry: [entry],
    outDir,
    format: ['esm', 'cjs'],
    dts: true,
    bundle: true,
    splitting: false,
    sourcemap: false,
    minify: false,
    clean: false,
    treeshake: true,
    target: 'es2020',
    platform: 'neutral',
    external: ['sharp', /^node:/u],
    skipNodeModulesBundle: true,
    outExtension({ format }) {
      return { js: format === 'cjs' ? '.cjs' : '.js' }
    },
    silent: true,
  })
}

await build({
  entry: ['src/cli/main.ts'],
  outDir: 'dist/cli',
  format: ['esm'],
  dts: false,
  bundle: true,
  splitting: false,
  sourcemap: false,
  minify: false,
  clean: false,
  treeshake: true,
  target: 'node20',
  platform: 'node',
  external: ['sharp'],
  skipNodeModulesBundle: true,
  silent: true,
})

await chmod('dist/cli/main.js', 0o755)

process.stdout.write(
  `built ${entries.length} public library entries and the CLI without shared chunks\n`,
)
