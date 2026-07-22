export function run({ module, inputs }) {
  const title = String(inputs.title).trim()
  const result = module.renderText(String(inputs.text), {
    font: inputs.font,
    frame: {
      style: inputs.frame,
      padding: Number(inputs.padding),
      title: title || undefined,
      titleAlign: inputs.titlealign,
    },
  })

  return {
    preview: result
      .toPlainText({
        preserveTrailingWhitespace: true,
      })
      .split('\n'),
    width: result.width,
    height: result.height,
  }
}
