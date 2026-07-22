import assert from 'node:assert/strict'
import { access, readFile, readdir } from 'node:fs/promises'
import { dirname, extname, join, normalize, resolve } from 'node:path'

const required = [
  'docs/index.md',
  'docs/getting-started.md',
  'docs/text-rendering.md',
  'docs/image-rendering.md',
  'docs/fonts.md',
  'docs/styling.md',
  'docs/output-formats.md',
  'docs/playground.md',
  'docs/cli.md',
  'docs/browser.md',
  'docs/node.md',
  'docs/vue.md',
  'docs/react.md',
  'docs/accessibility.md',
  'docs/security.md',
  'docs/performance.md',
  'docs/package-entries.md',
  'docs/api-reference.md',
  'docs/troubleshooting.md',
  'docs/production-checklist.md',
]

for (const file of required) await access(file)

async function markdownFiles(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await markdownFiles(path)))
    else if (extname(path) === '.md') files.push(path)
  }
  return files
}

const files = ['README.md', ...(await markdownFiles('docs'))]
const unfinished = /\b(?:TODO|TBD|FIXME|lorem ipsum|coming soon)\b/iu
const linkPattern = /(?<!!)\[[^\]]+\]\(([^)]+)\)/gu

for (const file of files) {
  const content = await readFile(file, 'utf8')
  assert.equal(
    unfinished.test(content),
    false,
    `${file} contains unfinished documentation language`,
  )

  for (const match of content.matchAll(linkPattern)) {
    const raw = match[1]?.trim()
    if (raw === undefined || raw.startsWith('#') || /^(?:https?:|mailto:)/u.test(raw)) continue
    const pathPart = raw.split('#', 1)[0]
    if (pathPart.length === 0) continue
    const target = normalize(resolve(dirname(file), decodeURIComponent(pathPart)))
    assert.ok(target.startsWith(resolve('.')), `${file} links outside the repository: ${raw}`)
    await access(target)
  }
}

process.stdout.write(`verified ${files.length} production documentation files and local links\n`)
