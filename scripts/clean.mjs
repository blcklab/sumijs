import { rm } from 'node:fs/promises'

await Promise.all(
  ['dist', 'coverage', '.pack-test', '.types-test'].map((path) =>
    rm(path, { recursive: true, force: true }),
  ),
)
