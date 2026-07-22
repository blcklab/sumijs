import assert from 'node:assert/strict'
import { access, readFile, readdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join } from 'node:path'

const packageJson = JSON.parse(await readFile('package.json', 'utf8'))
const require = createRequire(import.meta.url)

function runtimeTarget(branch) {
  if (typeof branch === 'string') return branch
  return branch?.default
}

for (const [subpath, target] of Object.entries(packageJson.exports)) {
  if (typeof target === 'string') {
    await access(target)
    process.stdout.write(`verified ${subpath}\n`)
    continue
  }

  const importTarget = runtimeTarget(target.import)
  const requireTarget = runtimeTarget(target.require)
  const importTypes = target.import?.types
  const requireTypes = target.require?.types

  for (const value of [importTarget, requireTarget, importTypes, requireTypes, target.default]) {
    if (value !== undefined) await access(value)
  }

  if (importTarget !== undefined) {
    const module = await import(
      new URL(`../${importTarget.replace(/^\.\//u, '')}`, import.meta.url)
    )
    assert.ok(module)
  }
  if (requireTarget !== undefined) {
    assert.ok(require(`../${requireTarget.replace(/^\.\//u, '')}`))
  }
  process.stdout.write(`verified ${subpath}\n`)
}

async function walk(directory) {
  const output = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) output.push(...(await walk(path)))
    else output.push(path)
  }
  return output
}

const generated = await walk('dist')
const chunkPattern = /-[A-Za-z0-9_]{6,}\.(?:d\.(?:ts|cts)|js|cjs)$/u
assert.equal(
  generated.some((file) => chunkPattern.test(file)),
  false,
  'dist contains an unexpected generated shared chunk',
)
process.stdout.write(`verified clean dist layout (${generated.length} files, no hashed chunks)\n`)
