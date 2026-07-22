export function run({ module, inputs }) {
  const result = module.renderText(String(inputs.text), {
    font: 'block',
    fallbackCharacter: String(inputs.fallback),
  })

  return {
    source: String(inputs.text),
    fallback: String(inputs.fallback),
    preview: result.toPlainText().split('\n'),
  }
}
