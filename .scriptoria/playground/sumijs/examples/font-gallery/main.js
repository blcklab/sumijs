export function run({ module, inputs }) {
  const text = String(inputs.text)

  return {
    text,
    fonts: module.listFonts().map((font) => {
      const result = module.renderText(text, { font })

      return {
        font,
        width: result.width,
        height: result.height,
        preview: result.toPlainText().split('\n'),
      }
    }),
  }
}
