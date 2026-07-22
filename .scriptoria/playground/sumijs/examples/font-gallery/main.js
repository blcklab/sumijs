export function run({ module, inputs }) {
  const text = String(inputs.text)
  const fonts = module.listFonts().map((font) => {
    const result = module.renderText(text, { font })

    return {
      font,
      width: result.width,
      height: result.height,
      preview: result.toPlainText().split('\n'),
      html: result.toHTML({
        ariaLabel: `${text} rendered with the ${font} font`,
        inlineStyles: true,
      }),
    }
  })

  const html = fonts
    .map(
      (item) =>
        `<div><p><strong>${item.font}</strong> <small>${item.width} × ${item.height}</small></p>${item.html}<br></div>`,
    )
    .join('')

  return {
    html,
    text,
    fonts: fonts.map(({ html: _html, ...font }) => font),
  }
}
