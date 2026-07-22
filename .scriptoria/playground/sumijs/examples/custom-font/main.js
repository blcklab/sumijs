export function run({ module, inputs }) {
  const glyphs = []

  for (let code = 32; code <= 126; code += 1) {
    const character = String.fromCharCode(code)
    const row = character === ' ' ? '$' : `[${character}]`
    glyphs.push(`${row}@@`)
  }

  const source = ['flf2a$ 1 1 1 0 0', ...glyphs].join('\n')
  const font = module.parseFont(source, 'bracket')
  const result = module.renderText(String(inputs.text), {
    font,
    layout: 'full',
  })

  return {
    font: {
      name: font.name,
      height: font.height,
      glyphs: Object.keys(font.glyphs).length,
    },
    preview: result.toPlainText().split('\n'),
  }
}
