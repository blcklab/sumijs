export function run({ module, inputs }) {
  const source = String(inputs.text)
  const fallback = String(inputs.fallback)
  const result = module.renderText(source, {
    font: 'block',
    fallbackCharacter: fallback,
  })

  return {
    html: result.toHTML({
      ariaLabel: `${source} rendered with fallback ${fallback}`,
      inlineStyles: true,
    }),
    source,
    fallback,
    plain: result.toPlainText().split('\n'),
  }
}
