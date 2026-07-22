export function run({ module }) {
  const result = module.renderText('HI', {
    font: 'mini',
    style: {
      color: '#8b5cf6',
      bold: true,
    },
  })

  return result.toJSON()
}
