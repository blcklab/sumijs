export async function run({ module, inputs }) {
  const sourceWidth = 64
  const sourceHeight = 16
  const data = new Uint8ClampedArray(sourceWidth * sourceHeight * 4)

  for (let y = 0; y < sourceHeight; y += 1) {
    for (let x = 0; x < sourceWidth; x += 1) {
      const offset = (y * sourceWidth + x) * 4
      const value = Math.round((x / (sourceWidth - 1)) * 255)
      data[offset] = value
      data[offset + 1] = value
      data[offset + 2] = value
      data[offset + 3] = 255
    }
  }

  const result = await module.renderImage(
    { width: sourceWidth, height: sourceHeight, data },
    {
      width: Number(inputs.width),
      height: 8,
      preserveAspectRatio: false,
      charset: inputs.charset,
      invert: Boolean(inputs.invert),
    },
  )

  return {
    html: result.toHTML({
      ariaLabel: 'A grayscale gradient rendered as ASCII art',
      inlineStyles: true,
    }),
    plain: result.toPlainText().split('\n'),
    width: result.width,
    height: result.height,
    charset: inputs.charset,
    invert: Boolean(inputs.invert),
  }
}
