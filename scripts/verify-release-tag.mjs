import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const packageJson = JSON.parse(await readFile('package.json', 'utf8'))
const ref = process.env.GITHUB_REF_NAME
assert.ok(ref, 'GITHUB_REF_NAME is unavailable')
assert.equal(
  ref,
  `v${packageJson.version}`,
  `tag ${ref} does not match package version ${packageJson.version}`,
)
process.stdout.write(`verified release tag ${ref}\n`)
