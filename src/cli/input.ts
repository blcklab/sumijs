export async function readPipedInput(): Promise<string | undefined> {
  if (process.stdin.isTTY) return undefined
  const chunks: Buffer[] = []
  for await (const chunk of process.stdin)
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  const value = Buffer.concat(chunks).toString('utf8')
  return value.length === 0 ? undefined : value.replace(/\r?\n$/u, '')
}
