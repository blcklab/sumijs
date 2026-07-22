export function terminalWidth(fallback = 80): number {
  const value = process.stdout.columns
  return Number.isInteger(value) && value > 0 ? value : fallback
}
