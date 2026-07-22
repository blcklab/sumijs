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
    preview: result.toPlainText({
      preserveTrailingWhitespace: true,
    }).split('\n'),
    width: result.width,
    height: result.height,
  }
}
