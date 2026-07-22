export function run({ module, inputs }) {
  try {
    if (inputs.scenario === 'unknown-font') {
      module.renderText('SUMI', { font: 'missing-font' })
    } else if (inputs.scenario === 'bad-width') {
      module.renderText('A VERY LONG WORD', {
        font: 'block',
        width: 4,
        overflow: 'wrap',
      })
    } else {
      module.parseFont('not a figlet font', 'broken')
    }

    return {
      caught: false,
      message: 'No error was raised.',
    }
  } catch (error) {
    if (error instanceof module.SumiError) {
      return {
        caught: true,
        name: error.name,
        code: error.code,
        message: error.message,
        details: error.details ?? null,
      }
    }

    throw error
  }
}
