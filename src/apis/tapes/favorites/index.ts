import { authorizedFetch } from '../../../auth'

import type { FavoriteTapeChange } from './types'
import { parseFavoriteTapeSet } from './parse'

export * from './types'

// https://golden-vcr.github.io/tapes/#/favorites/getFavorites
export async function fetchFavoriteTapeIds(): Promise<number[]> {
  const url = '/api/tapes/favorites'
  const r = await authorizedFetch(url)
  if (!r.ok) {
    let suffix = ''
    try {
      const message = await r.text()
      suffix = `: ${message}`
    } catch (ignored) {
    }
    throw new Error(`Got ${r.status} response from GET ${url}${suffix}`)
  }
  const data = await r.json()
  return parseFavoriteTapeSet(data).tapeIds
}

// https://golden-vcr.github.io/tapes/#/favorites/patchFavorites
export async function setTapeIsFavorite(tapeId: number, isFavorite: boolean): Promise<void> {
  const url = '/api/tapes/favorites'
  const r = await authorizedFetch(url, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      tapeId,
      isFavorite,
    } as FavoriteTapeChange)
  })
  if (!r.ok) {
    let suffix = ''
    try {
      const message = await r.text()
      suffix = `: ${message}`
    } catch (ignored) {
    }
    throw new Error(`Got ${r.status} response from PATCH ${url}${suffix}`)
  }
}
