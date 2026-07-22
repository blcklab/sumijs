export function ditherBrightness(matrix: number[][], levels: number): number[][] {
  const output = matrix.map((row) => [...row])
  const divisor = Math.max(1, levels - 1)
  for (let y = 0; y < output.length; y += 1) {
    const row = output[y]!
    for (let x = 0; x < row.length; x += 1) {
      const oldValue = row[x] ?? 0
      const newValue = Math.round(oldValue * divisor) / divisor
      row[x] = newValue
      const error = oldValue - newValue
      if (x + 1 < row.length) row[x + 1] = (row[x + 1] ?? 0) + (error * 7) / 16
      if (y + 1 < output.length) {
        const next = output[y + 1]!
        if (x > 0) next[x - 1] = (next[x - 1] ?? 0) + (error * 3) / 16
        next[x] = (next[x] ?? 0) + (error * 5) / 16
        if (x + 1 < next.length) next[x + 1] = (next[x + 1] ?? 0) + error / 16
      }
    }
  }
  return output.map((row) => row.map((value) => Math.max(0, Math.min(1, value))))
}
