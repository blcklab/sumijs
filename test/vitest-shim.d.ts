declare module 'vitest' {
  export function describe(name: string, callback: () => void): void
  export function it(name: string, callback: () => void | Promise<void>): void
  export function expect(value: unknown): {
    toBe(expected: unknown): void
    toEqual(expected: unknown): void
    toContain(expected: unknown): void
    toMatch(expected: RegExp | string): void
    toBeGreaterThan(expected: number): void
    toBeLessThan(expected: number): void
    toThrow(expected?: unknown): void
    not: {
      toBe(expected: unknown): void
      toContain(expected: unknown): void
      toThrow(expected?: unknown): void
    }
  }
}
