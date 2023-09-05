import { type Tape, parseTape } from "./types"

export async function fetchTapes(): Promise<Tape[]> {
  const url = '/api/tapes'
  const r = await fetch(url)
  if (!r.ok) {
    let suffix = ''
    try {
      const message = await r.text()
      suffix = `: ${message}`
    } catch (ignored) {
    }
    throw new Error(`Got ${r.status} response from ${url}${suffix}`)
  }
  const data = await r.json()
  if (!Array.isArray(data)) {
    throw new Error(`Got non-array response from ${url}`)
  }
  return data.map(parseTape)
}
