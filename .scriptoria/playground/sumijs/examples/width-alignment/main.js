export function run({ module, inputs }) {
  const text = String(inputs.text)
  const result = module.renderText(text, {
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
    html: result.toHTML({
      ariaLabel: `${text}, ${inputs.align} aligned with ${inputs.overflow} overflow`,
      inlineStyles: true,
    }),
    plain: result.toPlainText({ preserveTrailingWhitespace: true }).split('\n'),
    width: result.width,
    height: result.height,
    align: inputs.align,
    overflow: inputs.overflow,
  }
}
