export function run({ module }) {
  const result = module.renderText('INK', {
    font: 'mini',
    frame: {
      style: {
        topLeft: '╭',
        top: '─',
        topRight: '◇',
        right: '│',
        bottomRight: '╯',
        bottom: '─',
        bottomLeft: '◆',
        left: '│',
      },
      padding: { top: 1, right: 3, bottom: 1, left: 3 },
      title: 'custom',
      titleAlign: 'right',
    },
  })

  return {
    html: result.toHTML({
      ariaLabel: 'INK inside a custom border',
      inlineStyles: true,
    }),
    plain: result.toPlainText({ preserveTrailingWhitespace: true }).split('\n'),
    width: result.width,
    height: result.height,
  }
}
