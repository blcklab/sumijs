export type BuiltInFontName = 'block' | 'slant' | 'shadow' | 'mini' | 'three-d'
export type TextLayout = 'full' | 'fitted' | 'smushed'
export type TextAlign = 'left' | 'center' | 'right'
export type OverflowMode = 'preserve' | 'clip' | 'wrap'
export type OutputFormat = 'plain' | 'ansi' | 'html' | 'svg' | 'json'
export type ANSIColorLevel = 0 | 1 | 2 | 3
export type CharacterSetName = 'minimal' | 'standard' | 'detailed' | 'blocks' | 'binary'
export type SamplingMode = 'average' | 'nearest'
export type GradientDirection = 'horizontal' | 'vertical' | 'diagonal'

export interface RGBColor {
  readonly red: number
  readonly green: number
  readonly blue: number
}

export type ColorInput = string | RGBColor

export interface CellStyle {
  readonly foreground?: string
  readonly background?: string
  readonly bold?: boolean
  readonly dim?: boolean
  readonly italic?: boolean
  readonly underline?: boolean
}

export interface AsciiCell extends CellStyle {
  readonly character: string
  readonly sourceBrightness?: number
}

export interface RenderMetadata {
  readonly source: 'text' | 'image'
  readonly font?: string
  readonly inputWidth?: number
  readonly inputHeight?: number
  readonly defaultFormat?: OutputFormat
  readonly accessibleText?: string
}

export interface AsciiGrid {
  readonly width: number
  readonly height: number
  readonly rows: readonly (readonly AsciiCell[])[]
  readonly metadata: RenderMetadata
}

export interface SerializableAsciiGrid {
  readonly version: 1
  readonly width: number
  readonly height: number
  readonly rows: Array<
    Array<{
      character: string
      foreground?: string
      background?: string
      bold?: boolean
      dim?: boolean
      italic?: boolean
      underline?: boolean
    }>
  >
  readonly metadata: {
    source: 'text' | 'image'
    font?: string
    inputWidth?: number
    inputHeight?: number
  }
}

export interface SumiFont {
  readonly name: string
  readonly height: number
  readonly baseline?: number
  readonly hardblank?: string
  readonly horizontalLayout?: TextLayout
  readonly glyphs: Readonly<Record<string, readonly string[]>>
}

export interface StyleOptions {
  readonly color?: ColorInput
  readonly backgroundColor?: ColorInput
  readonly gradient?: readonly [ColorInput, ColorInput, ...ColorInput[]]
  readonly gradientDirection?: GradientDirection
  readonly gradientWhitespace?: boolean
  readonly bold?: boolean
  readonly dim?: boolean
  readonly italic?: boolean
  readonly underline?: boolean
}

export interface CustomBorderCharacters {
  readonly topLeft: string
  readonly top: string
  readonly topRight: string
  readonly right: string
  readonly bottomRight: string
  readonly bottom: string
  readonly bottomLeft: string
  readonly left: string
}

export interface BoxSpacing {
  readonly top?: number
  readonly right?: number
  readonly bottom?: number
  readonly left?: number
}

export interface FrameOptions {
  readonly style?: 'single' | 'double' | 'rounded' | 'heavy' | CustomBorderCharacters
  readonly padding?: number | BoxSpacing
  readonly margin?: number | BoxSpacing
  readonly title?: string
  readonly titleAlign?: TextAlign
}

export interface RenderTextOptions {
  readonly font?: BuiltInFontName | SumiFont
  readonly layout?: TextLayout
  readonly align?: TextAlign
  readonly width?: number
  readonly maxWidth?: number
  readonly overflow?: OverflowMode
  readonly lineSpacing?: number
  readonly letterSpacing?: number
  readonly fallbackCharacter?: string
  readonly trim?: boolean
  readonly style?: StyleOptions
  readonly frame?: FrameOptions | false
  readonly defaultFormat?: OutputFormat
}

export type TreeShakableRenderTextOptions = Omit<RenderTextOptions, 'font'> & {
  readonly font?: 'block' | SumiFont
}

export interface DecodedImage {
  readonly width: number
  readonly height: number
  readonly data: Uint8ClampedArray
}

export interface BlobLike {
  readonly size?: number
  readonly type?: string
  arrayBuffer(): Promise<ArrayBuffer>
}

export interface BrowserImageElementLike {
  readonly width: number
  readonly height: number
}

export type ImageInput =
  string | Uint8Array | ArrayBuffer | BlobLike | DecodedImage | BrowserImageElementLike

export interface ImageDecoder {
  decode(input: ImageInput): Promise<DecodedImage>
}

export type LuminanceFunction = (red: number, green: number, blue: number, alpha: number) => number

export interface ImageSafetyLimits {
  readonly maxSourcePixels?: number
  readonly maxOutputWidth?: number
  readonly maxOutputHeight?: number
  readonly maxOutputCells?: number
}

export interface RenderImageOptions {
  readonly decoder?: ImageDecoder
  readonly width?: number
  readonly height?: number
  readonly preserveAspectRatio?: boolean
  readonly cellRatio?: number
  readonly charset?: CharacterSetName
  readonly characters?: string
  readonly sampling?: SamplingMode
  readonly invert?: boolean
  readonly grayscale?: boolean
  readonly color?: boolean
  readonly background?: ColorInput
  readonly transparentCharacter?: string
  readonly alphaThreshold?: number
  readonly contrast?: number
  readonly brightness?: number
  readonly gamma?: number
  readonly threshold?: number
  readonly dither?: boolean
  readonly luminance?: LuminanceFunction
  readonly style?: StyleOptions
  readonly frame?: FrameOptions | false
  readonly align?: TextAlign
  readonly outputWidth?: number
  readonly defaultFormat?: OutputFormat
  readonly limits?: ImageSafetyLimits
}

export interface PlainTextOptions {
  readonly preserveTrailingWhitespace?: boolean
  readonly finalNewline?: boolean
  readonly lineEnding?: '\n' | '\r\n'
}

export interface ANSIFormatOptions extends PlainTextOptions {
  readonly colorLevel?: ANSIColorLevel
}

export interface HTMLFormatOptions {
  readonly className?: string
  readonly ariaLabel?: string
  readonly accessibleText?: string
  readonly includePre?: boolean
  readonly includeContainer?: boolean
  readonly containerClassName?: string
  readonly inlineStyles?: boolean
}

export interface SVGFormatOptions {
  readonly fontFamily?: string
  readonly fontSize?: number
  readonly lineHeight?: number
  readonly letterSpacing?: number
  readonly background?: ColorInput | 'transparent'
  readonly title?: string
  readonly description?: string
  readonly ariaLabel?: string
}

export interface StringFormatOptions {
  readonly format?: OutputFormat
  readonly ansi?: ANSIFormatOptions
  readonly plain?: PlainTextOptions
  readonly html?: HTMLFormatOptions
  readonly svg?: SVGFormatOptions
}

export interface RenderResult {
  readonly grid: AsciiGrid
  readonly width: number
  readonly height: number
  toString(options?: StringFormatOptions): string
  toPlainText(options?: PlainTextOptions): string
  toANSI(options?: ANSIFormatOptions): string
  toHTML(options?: HTMLFormatOptions): string
  toSVG(options?: SVGFormatOptions): string
  toJSON(): SerializableAsciiGrid
}
