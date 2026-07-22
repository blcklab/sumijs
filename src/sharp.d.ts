declare module 'sharp' {
  interface RawInfo {
    width: number
    height: number
  }
  interface RawResult {
    data: Uint8Array
    info: RawInfo
  }
  interface SharpInstance {
    ensureAlpha(): SharpInstance
    raw(): SharpInstance
    toBuffer(options: { resolveWithObject: true }): Promise<RawResult>
  }
  type SharpFactory = (input: Uint8Array) => SharpInstance
  const sharp: SharpFactory
  export default sharp
}
