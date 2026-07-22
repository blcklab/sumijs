import type { AsciiGrid, SerializableAsciiGrid } from '../types.js'

export function formatJSON(grid: AsciiGrid): SerializableAsciiGrid {
  return {
    version: 1,
    width: grid.width,
    height: grid.height,
    rows: grid.rows.map((row) =>
      row.map((item) => ({
        character: item.character,
        ...(item.foreground === undefined ? {} : { foreground: item.foreground }),
        ...(item.background === undefined ? {} : { background: item.background }),
        ...(item.bold === undefined ? {} : { bold: item.bold }),
        ...(item.dim === undefined ? {} : { dim: item.dim }),
        ...(item.italic === undefined ? {} : { italic: item.italic }),
        ...(item.underline === undefined ? {} : { underline: item.underline }),
      })),
    ),
    metadata: {
      source: grid.metadata.source,
      ...(grid.metadata.font === undefined ? {} : { font: grid.metadata.font }),
      ...(grid.metadata.inputWidth === undefined ? {} : { inputWidth: grid.metadata.inputWidth }),
      ...(grid.metadata.inputHeight === undefined
        ? {}
        : { inputHeight: grid.metadata.inputHeight }),
    },
  }
}
