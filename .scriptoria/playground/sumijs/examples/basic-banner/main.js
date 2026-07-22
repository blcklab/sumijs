export function run({ module, inputs }) {
  const result = module.renderText(String(inputs.text), {
    font: inputs.font,
    layout: inputs.layout,
  })

  return {
    preview: result.toPlainText().split('\n'),
    width: result.width,
    height: result.height,
    font: result.grid.metadata.font,
  }
}
