export function run({ module, inputs }) {
  const text = String(inputs.text)
  const font = inputs.font

  return {
    text,
    font,
    layouts: ['full', 'fitted', 'smushed'].map((layout) => {
      const result = module.renderText(text, { font, layout })

      return {
        layout,
        width: result.width,
        preview: result.toPlainText().split('\n'),
      }
    }),
  }
}
