export function run({ module, inputs }) {
  const text = String(inputs.text).replace(/\s*\/\s*/gu, '\n')
  const result = module.renderText(text, {
    font: inputs.font,
    lineSpacing: Number(inputs.line),
  })

  return {
    html: result.toHTML({
      ariaLabel: text.replace(/\n/gu, ', '),
      inlineStyles: true,
    }),
    source: text.split('\n'),
    plain: result.toPlainText().split('\n'),
    width: result.width,
    height: result.height,
    lineSpacing: Number(inputs.line),
  }
}
