export async function run({ module, inputs }) {
  const width = 48
  const height = 20
  const data = new Uint8ClampedArray(width * height * 4)
  const centerX = (width - 1) / 2
  const centerY = (height - 1) / 2
  const radius = Math.min(width, height) * 0.46

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4
      const distance = Math.hypot(x - centerX, y - centerY)
      const value = Math.round(Math.max(0, 1 - distance / radius) * 255)
      data[offset] = value
      data[offset + 1] = value
      data[offset + 2] = value
      data[offset + 3] = 255
    }
  }

  const result = await module.renderImage(
    { width, height, data },
    {
      width: 48,
      height: 20,
      preserveAspectRatio: false,
      characters: ' #',
      threshold: Number(inputs.threshold),
      dither: Boolean(inputs.dither),
      invert: Boolean(inputs.invert),
    },
  )

  return {
    preview: result.toPlainText().split('\n'),
    threshold: Number(inputs.threshold),
    dither: Boolean(inputs.dither),
    invert: Boolean(inputs.invert),
  }
}
