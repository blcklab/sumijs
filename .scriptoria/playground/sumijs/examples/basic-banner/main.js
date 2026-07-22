export function run({ module, inputs }) {
  const text = String(inputs.text)
  const result = module.renderText(text, {
    font: inputs.font,
    layout: inputs.layout,
  })

  return {
    html: result.toHTML({
      ariaLabel: `${text} rendered with the ${inputs.font} font`,
      inlineStyles: true,
    }),
    plain: result.toPlainText().split('\n'),
    width: result.width,
    height: result.height,
    font: result.grid.metadata.font,
    layout: inputs.layout,
  }
}
