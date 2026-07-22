export async function run({ module }) {
  const colors = [
    [239, 68, 68],
    [249, 115, 22],
    [234, 179, 8],
    [34, 197, 94],
    [6, 182, 212],
    [99, 102, 241],
    [168, 85, 247],
    [236, 72, 153],
  ]
  const width = colors.length
  const height = 4
  const data = new Uint8ClampedArray(width * height * 4)

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4
      const [red, green, blue] = colors[x]
      data[offset] = red
      data[offset + 1] = green
      data[offset + 2] = blue
      data[offset + 3] = 255
    }
  }

  const result = await module.renderImage(
    { width, height, data },
    {
      width,
      height,
      preserveAspectRatio: false,
      characters: ' █',
      color: true,
    },
  )

  return {
    preview: result.toPlainText().split('\n'),
    foregroundColors: result.grid.rows[0].map((cell) => cell.foreground),
    html: result.toHTML({
      ariaLabel: 'Eight colored ASCII bars',
      inlineStyles: true,
    }),
  }
}
