export function run({ module, inputs }) {
  const glyphs = []

  for (let code = 32; code <= 126; code += 1) {
    const character = String.fromCharCode(code)
    const row = character === ' ' ? '$' : `[${character}]`
    glyphs.push(`${row}@@`)
  }

  const source = ['flf2a$ 1 1 1 0 0', ...glyphs].join('\n')
  const font = module.parseFont(source, 'bracket')
  const text = String(inputs.text)
  const result = module.renderText(text, {
    font,
    layout: 'full',
  })

  return {
    html: result.toHTML({
      ariaLabel: `${text} rendered with a generated bracket font`,
      inlineStyles: true,
    }),
    font: {
      name: font.name,
      height: font.height,
      glyphs: Object.keys(font.glyphs).length,
    },
    plain: result.toPlainText().split('\n'),
  }
}
