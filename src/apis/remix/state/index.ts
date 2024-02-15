import type { ClipListing } from './types'
import { parseClipListing } from './parse'

export * from './types'

// https://golden-vcr.github.io/remix/#/state/getClips
export async function fetchClipListing(): Promise<ClipListing> {
  const url = '/api/remix/clips'
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
  return parseClipListing(data)
}
