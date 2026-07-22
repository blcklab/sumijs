# Errors

Operational failures use `SumiError`.

```ts
import { SumiError } from 'sumijs'

try {
  renderText('SUMI', options)
} catch (error) {
  if (error instanceof SumiError) {
    console.error(error.code, error.message, error.details)
  }
}
```

## Error codes

| Code                     | Meaning                                                         |
| ------------------------ | --------------------------------------------------------------- |
| `INVALID_OPTIONS`        | An option value or combination is invalid                       |
| `INVALID_DIMENSIONS`     | A requested dimension is invalid or impossible                  |
| `UNKNOWN_FONT`           | A built-in font name is unsupported                             |
| `MALFORMED_FONT`         | FIGlet font data is invalid or incomplete                       |
| `UNSUPPORTED_INPUT`      | The input type is not supported by the selected path            |
| `IMAGE_DECODER_REQUIRED` | Encoded input was provided without a decoder or Sharp is absent |
| `IMAGE_DECODE_FAILED`    | The selected decoder could not decode the image                 |
| `OUTPUT_TOO_LARGE`       | Source or output dimensions exceed safety limits                |
| `UNSUPPORTED_FORMAT`     | A requested serialization format is unsupported                 |
| `FILE_ALREADY_EXISTS`    | The CLI protected an existing output file                       |

`details` contains structured context for selected failures. The original cause is preserved through the standard `Error.cause` field when available.

Do not depend on complete error-message text. Use `code` for program behavior and log the message for human diagnosis.
