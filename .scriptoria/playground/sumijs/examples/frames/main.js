export function run({ module, inputs }) {
  const text = String(inputs.text)
  const title = String(inputs.title).trim()
  const result = module.renderText(text, {
    font: inputs.font,
    frame: {
      style: inputs.frame,
      padding: Number(inputs.padding),
      title: title || undefined,
      titleAlign: inputs.titlealign,
    },
  })

  return {
    html: result.toHTML({
      ariaLabel: `${text} inside a ${inputs.frame} frame`,
      inlineStyles: true,
    }),
    plain: result
      .toPlainText({ preserveTrailingWhitespace: true })
      .split('\n'),
    width: result.width,
    height: result.height,
    frame: inputs.frame,
    title: title || null,
    titleAlign: inputs.titlealign,
  }
}
