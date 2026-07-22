export function run({ module, inputs }) {
  const text = String(inputs.text)
  const result = module.renderText(text, {
    font: inputs.font,
    style: {
      gradient: [String(inputs.start), String(inputs.end)],
      gradientDirection: inputs.direction,
      bold: true,
    },
  })

  const sampledForegroundColors = result.grid.rows
    .flat()
    .filter((cell) => cell.character !== ' ' && cell.foreground)
    .slice(0, 12)
    .map((cell) => cell.foreground)

  return {
    html: result.toHTML({
      ariaLabel: text,
      inlineStyles: true,
    }),
    plain: result.toPlainText().split('\n'),
    direction: inputs.direction,
    sampledForegroundColors,
    width: result.width,
    height: result.height,
  }
}
