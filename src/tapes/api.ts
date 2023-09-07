import { type TapeListing, parseTapeListing } from "./types"

export async function fetchTapes(): Promise<TapeListing> {
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
  return parseTapeListing(data)
}
