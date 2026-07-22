export function run({ module, inputs }) {
  const result = module.renderText(String(inputs.text), {
    font: 'mini',
    width: Number(inputs.width),
    align: inputs.align,
    overflow: inputs.overflow,
    frame: {
      style: 'single',
      padding: { left: 1, right: 1 },
    },
  })

  return {
    preview: result.toPlainText({
      preserveTrailingWhitespace: true,
    }).split('\n'),
    width: result.width,
    height: result.height,
    align: inputs.align,
    overflow: inputs.overflow,
  }
}
