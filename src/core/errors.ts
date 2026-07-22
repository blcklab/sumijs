export type SumiErrorCode =
  | 'INVALID_OPTIONS'
  | 'INVALID_DIMENSIONS'
  | 'UNKNOWN_FONT'
  | 'MALFORMED_FONT'
  | 'UNSUPPORTED_INPUT'
  | 'IMAGE_DECODER_REQUIRED'
  | 'IMAGE_DECODE_FAILED'
  | 'OUTPUT_TOO_LARGE'
  | 'UNSUPPORTED_FORMAT'
  | 'FILE_ALREADY_EXISTS'

export class SumiError extends Error {
  readonly code: SumiErrorCode
  readonly details?: Readonly<Record<string, unknown>>

  constructor(
    code: SumiErrorCode,
    message: string,
    details?: Readonly<Record<string, unknown>>,
    cause?: unknown,
  ) {
    super(message, { cause })
    this.name = 'SumiError'
    this.code = code
    if (details !== undefined) this.details = details
  }
}

export function assertFinitePositive(value: number, name: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new SumiError(
      'INVALID_DIMENSIONS',
      `${name} must be a finite number greater than zero.`,
      {
        [name]: value,
      },
    )
  }
}

export function assertNonNegativeInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new SumiError('INVALID_OPTIONS', `${name} must be a non-negative integer.`, {
      [name]: value,
    })
  }
}
