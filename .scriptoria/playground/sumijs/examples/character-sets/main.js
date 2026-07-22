export async function run({ module }) {
  const width = 32
  const height = 8
  const data = new Uint8ClampedArray(width * height * 4)

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4
      const value = Math.round(((x + y * 2) / (width + height * 2 - 3)) * 255)
      data[offset] = value
      data[offset + 1] = value
      data[offset + 2] = value
      data[offset + 3] = 255
    }
  }

  const input = { width, height, data }
  const previews = []

  for (const charset of Object.keys(module.CHARACTER_SETS)) {
    const result = await module.renderImage(input, {
      width: 32,
      height: 6,
      preserveAspectRatio: false,
      charset,
    })

    previews.push({
      charset,
      ramp: module.CHARACTER_SETS[charset],
      preview: result.toPlainText().split('\n'),
      html: result.toHTML({
        ariaLabel: `${charset} character set`,
        inlineStyles: true,
      }),
    })
  }

  return {
    html: previews
      .map(
        (item) =>
          `<div><p><strong>${item.charset}</strong> <small>${item.ramp}</small></p>${item.html}<br></div>`,
      )
      .join(''),
    previews: previews.map((item) => ({
      charset: item.charset,
      ramp: item.ramp,
      preview: item.preview,
    })),
  }
}
