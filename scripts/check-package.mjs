import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const root = process.cwd()
const temp = await mkdtemp(join(tmpdir(), 'sumijs-release-'))
const executable = (name) =>
  join(root, 'node_modules', '.bin', process.platform === 'win32' ? `${name}.cmd` : name)

const run = (command, args) => {
  const result = spawnSync(command, args, {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
    shell: false,
  })

  if (result.error) throw result.error
  assert.equal(result.status, 0, `${command} exited with ${result.status ?? 'an unknown status'}`)
}

try {
  const packed = spawnSync(
    'npm',
    ['pack', '--json', '--ignore-scripts', '--pack-destination', temp],
    {
      cwd: root,
      encoding: 'utf8',
      shell: false,
    },
  )
  assert.equal(packed.status, 0, packed.stderr)

  const info = JSON.parse(packed.stdout)[0]
  assert.ok(info?.filename, 'npm pack did not return an archive filename')
  const archive = resolve(temp, info.filename)

  run(executable('attw'), [archive, '--profile', 'node16'])
  run(executable('publint'), ['run', archive])
  run(process.execPath, ['scripts/verify-package.mjs', archive])
} finally {
  await rm(temp, { recursive: true, force: true })
}
