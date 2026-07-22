export function run({ module, inputs }) {
  const text = String(inputs.text).replace(/\s*\/\s*/gu, '\n')
  const result = module.renderText(text, {
    font: inputs.font,
    lineSpacing: Number(inputs.line),
  })

  return {
    source: text.split('\n'),
    preview: result.toPlainText().split('\n'),
    width: result.width,
    height: result.height,
  }
}
