import assert from 'node:assert/strict'
import { chmod, mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { build } from 'esbuild'

const root = process.cwd()
const providedArchive = process.argv[2]
let archive
let ownsArchive = false
let info

if (providedArchive) {
  archive = resolve(root, providedArchive)
  const listing = spawnSync('tar', ['-tzf', archive], { encoding: 'utf8' })
  assert.equal(listing.status, 0, listing.stderr)
  const paths = listing.stdout
    .split('\n')
    .filter(Boolean)
    .map((path) => path.replace(/^package\//, ''))
    .filter((path) => path && !path.endsWith('/'))
  const packageJson = JSON.parse(
    spawnSync('tar', ['-xOzf', archive, 'package/package.json'], { encoding: 'utf8' }).stdout,
  )
  info = {
    filename: archive,
    files: paths.map((path) => ({ path })),
    size: (await stat(archive)).size,
    version: packageJson.version,
  }
} else {
  const packed = spawnSync('npm', ['pack', '--json', '--ignore-scripts'], {
    cwd: root,
    encoding: 'utf8',
  })
  assert.equal(packed.status, 0, packed.stderr)
  info = JSON.parse(packed.stdout)[0]
  assert.ok(info)
  archive = resolve(root, info.filename)
  ownsArchive = true
}

const forbidden = [
  'src/',
  'test/',
  'examples/',
  'scripts/',
  'docs/',
  '.github/',
  'coverage/',
  'BUILD_REPORT.md',
  'PUBLISHING.md',
  'CONTRIBUTING.md',
]
for (const file of info.files) {
  assert.ok(
    !forbidden.some((prefix) => file.path === prefix || file.path.startsWith(prefix)),
    `unexpected packed file: ${file.path}`,
  )
}

const temp = await mkdtemp(join(tmpdir(), 'sumijs-pack-'))
const packageRoot = join(temp, 'node_modules', '@blcklab', 'sumijs')
await mkdir(packageRoot, { recursive: true })
const extract = spawnSync('tar', ['-xzf', archive, '--strip-components=1', '-C', packageRoot], {
  encoding: 'utf8',
})
assert.equal(extract.status, 0, extract.stderr)
await chmod(join(packageRoot, 'dist', 'cli', 'main.js'), 0o755)

const esmProbe = join(temp, 'esm-probe.mjs')
await writeFile(
  esmProbe,
  [
    "import { renderText } from '@blcklab/sumijs'",
    "import { renderText as renderTextCore } from '@blcklab/sumijs/text'",
    "import { block } from '@blcklab/sumijs/fonts/block'",
    "import { createBrowserImageDecoder } from '@blcklab/sumijs/image/browser'",
    "if (typeof renderText !== 'function' || typeof renderTextCore !== 'function') process.exit(1)",
    "if (block.name !== 'block' || typeof createBrowserImageDecoder !== 'function') process.exit(1)",
  ].join('\n'),
  'utf8',
)
const esm = spawnSync(process.execPath, [esmProbe], { cwd: temp, encoding: 'utf8' })
assert.equal(esm.status, 0, esm.stderr)

const cjsProbe = join(temp, 'cjs-probe.cjs')
await writeFile(
  cjsProbe,
  [
    "const root = require('@blcklab/sumijs')",
    "const text = require('@blcklab/sumijs/text')",
    "const block = require('@blcklab/sumijs/fonts/block')",
    "const nodeImage = require('@blcklab/sumijs/image/node')",
    "if (typeof root.renderText !== 'function' || typeof text.renderText !== 'function') process.exit(1)",
    "if (block.block.name !== 'block' || typeof nodeImage.createNodeImageDecoder !== 'function') process.exit(1)",
  ].join('\n'),
  'utf8',
)
const cjs = spawnSync(process.execPath, [cjsProbe], { cwd: temp, encoding: 'utf8' })
assert.equal(cjs.status, 0, cjs.stderr)

const cli = spawnSync(
  process.execPath,
  [join(packageRoot, 'dist', 'cli', 'main.js'), '--version'],
  {
    cwd: temp,
    encoding: 'utf8',
  },
)
assert.equal(cli.status, 0, cli.stderr)
assert.equal(cli.stdout.trim(), info.version)

await build({
  stdin: {
    contents:
      "import { renderText } from '@blcklab/sumijs/text'; import { block } from '@blcklab/sumijs/fonts/block'; console.log(renderText('WEB', { font: block }).width)",
    resolveDir: temp,
  },
  absWorkingDir: temp,
  bundle: true,
  write: false,
  platform: 'browser',
  format: 'esm',
  treeShaking: true,
  logLevel: 'silent',
})

await writeFile(
  join(temp, 'consumer.mts'),
  [
    "import { renderText } from '@blcklab/sumijs'",
    "import { block } from '@blcklab/sumijs/fonts/block'",
    "const output: string = renderText('TYPE', { font: block }).toPlainText()",
    'void output',
  ].join('\n'),
  'utf8',
)
await writeFile(
  join(temp, 'consumer.cts'),
  [
    "import { renderText } from '@blcklab/sumijs'",
    "import { block } from '@blcklab/sumijs/fonts/block'",
    "const output: string = renderText('TYPE', { font: block }).toPlainText()",
    'void output',
  ].join('\n'),
  'utf8',
)
await writeFile(
  join(temp, 'tsconfig.json'),
  JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        strict: true,
        noEmit: true,
        skipLibCheck: false,
      },
      include: ['consumer.mts', 'consumer.cts'],
    },
    null,
    2,
  ),
  'utf8',
)
const tsc = spawnSync(
  process.execPath,
  [join(root, 'node_modules', 'typescript', 'bin', 'tsc'), '-p', join(temp, 'tsconfig.json')],
  { cwd: temp, encoding: 'utf8' },
)
assert.equal(tsc.status, 0, `${tsc.stdout}\n${tsc.stderr}`)

await readFile(join(packageRoot, 'dist', 'index.d.ts'), 'utf8')
await readFile(join(packageRoot, 'dist', 'index.d.cts'), 'utf8')
await readFile(join(packageRoot, 'dist', 'cli', 'main.js'), 'utf8')

await rm(temp, { recursive: true, force: true })
if (ownsArchive) await rm(archive, { force: true })
process.stdout.write(
  `verified packed package (${info.size} bytes, ${info.files.length} files; ESM, CJS, types, CLI, browser bundle)\n`,
)
