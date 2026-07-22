export function run({ module, inputs }) {
  const text = String(inputs.text)
  const font = inputs.font
  const layouts = ['full', 'fitted', 'smushed'].map((layout) => {
    const result = module.renderText(text, { font, layout })

    return {
      layout,
      width: result.width,
      height: result.height,
      preview: result.toPlainText().split('\n'),
      html: result.toHTML({
        ariaLabel: `${text} using ${layout} layout`,
        inlineStyles: true,
      }),
    }
  })

  return {
    html: layouts
      .map(
        (item) =>
          `<div><p><strong>${item.layout}</strong> <small>${item.width} columns</small></p>${item.html}<br></div>`,
      )
      .join(''),
    text,
    font,
    layouts: layouts.map((item) => ({
      layout: item.layout,
      width: item.width,
      height: item.height,
      preview: item.preview,
    })),
  }
}
