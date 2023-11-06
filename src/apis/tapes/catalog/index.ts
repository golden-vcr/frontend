import type { CatalogListing } from './types'
import { parseCatalogListing } from './parse'

export * from './types'

// https://golden-vcr.github.io/tapes/#/catalog/getCatalog
export async function fetchCatalogListing(): Promise<CatalogListing> {
  const url = '/api/tapes/catalog'
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
  return parseCatalogListing(data)
}
