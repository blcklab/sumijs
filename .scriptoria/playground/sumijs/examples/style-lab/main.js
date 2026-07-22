export function run({ module, inputs }) {
  const text = String(inputs.text)
  const result = module.renderText(text, {
    font: inputs.font,
    style: {
      color: String(inputs.foreground),
      backgroundColor: String(inputs.background),
      bold: Boolean(inputs.bold),
      italic: Boolean(inputs.italic),
      underline: Boolean(inputs.underline),
    },
  })

  return {
    html: result.toHTML({
      ariaLabel: `${text} with solid foreground and background colors`,
      inlineStyles: true,
    }),
    plain: result.toPlainText().split('\n'),
    width: result.width,
    height: result.height,
    style: {
      foreground: inputs.foreground,
      background: inputs.background,
      bold: Boolean(inputs.bold),
      italic: Boolean(inputs.italic),
      underline: Boolean(inputs.underline),
    },
  }
}
