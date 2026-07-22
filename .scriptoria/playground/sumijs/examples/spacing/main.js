export function run({ module, inputs }) {
  const text = String(inputs.text).replace(/\s*\/\s*/gu, '\n')
  const result = module.renderText(text, {
    font: 'mini',
    letterSpacing: Number(inputs.letter),
    lineSpacing: Number(inputs.line),
  })

  return {
    html: result.toHTML({
      ariaLabel: text.replace(/\n/gu, ', '),
      inlineStyles: true,
    }),
    plain: result.toPlainText().split('\n'),
    width: result.width,
    height: result.height,
    letterSpacing: Number(inputs.letter),
    lineSpacing: Number(inputs.line),
  }
}
