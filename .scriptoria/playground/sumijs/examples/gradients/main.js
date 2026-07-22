export function run({ module, inputs }) {
  const result = module.renderText(String(inputs.text), {
    font: inputs.font,
    style: {
      gradient: [String(inputs.start), String(inputs.end)],
      gradientDirection: inputs.direction,
      bold: true,
    },
  })

  const colors = result.grid.rows
    .flat()
    .filter((cell) => cell.character !== ' ' && cell.foreground)
    .slice(0, 12)
    .map((cell) => cell.foreground)

  return {
    preview: result.toPlainText().split('\n'),
    direction: inputs.direction,
    sampledForegroundColors: colors,
    html: result.toHTML({
      ariaLabel: String(inputs.text),
      inlineStyles: true,
    }),
  }
}
