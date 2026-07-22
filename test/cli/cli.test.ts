import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

const cli = new URL('../../src/cli/main.ts', import.meta.url)

function run(args: readonly string[], input?: string) {
  return spawnSync(process.execPath, ['--import', 'tsx', cli.pathname, ...args], {
    encoding: 'utf8',
    ...(input === undefined ? {} : { input }),
  })
}

describe('CLI', () => {
  it('renders positional text', () => {
    const result = run(['HELLO', '--format', 'plain'])
    expect(result.status).toBe(0)
    expect(result.stdout.length).toBeGreaterThan(0)
    expect(result.stderr).toBe('')
  })

  it('lists fonts and displays help', () => {
    const fonts = run(['--list-fonts'])
    const help = run(['--help'])
    expect(fonts.stdout).toContain('block')
    expect(help.stdout).toContain('Usage:')
  })

  it('accepts piped stdin', () => {
    const result = run(['--format', 'plain'], 'HELLO\n')
    expect(result.status).toBe(0)
    expect(result.stdout.length).toBeGreaterThan(0)
  })
})
