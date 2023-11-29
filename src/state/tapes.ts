import { writable, derived } from 'svelte/store'

import { fetchCatalogListing, type CatalogListing } from '../apis/tapes/catalog'
import { fetchBroadcastSummary, type BroadcastSummary } from '../apis/showtime/history'
import { fetchFavoriteTapeIds, setTapeIsFavorite } from '../apis/tapes/favorites'

import { isViewer } from './access'
import { signalError } from './errors'

export type Tape = {
  id: number
  title: string
  year?: number
  runtime?: number
  contributor?: string
  color: string
  thumbnailImage: string
  images: TapeImage[]
  tags: string[]
  broadcastIds: number[]
  isFavorite: boolean
  onToggleFavorite: (() => void) | null
}

export type TapeImage = {
  url: string
  alt: string
  width: number
  height: number
  displayRotatedCW: boolean
}

const catalogListing = writable(null as CatalogListing | null)
const broadcastSummary = writable(null as BroadcastSummary | null)
const favoriteTapeIds = writable([] as number[])

export function initTapes() {
  fetchCatalogListing().then(catalogListing.set).catch((err) => {
    const message = (err instanceof Error) ? err.message : String(err)
    signalError(`Failed to fetch tape listing: ${message}`)
  })
  fetchBroadcastSummary().then(broadcastSummary.set).catch((err) => {
    const message = (err instanceof Error) ? err.message : String(err)
    signalError(`Failed to fetch broadcast summary: ${message}`)
  })
}

function updateFavoriteFlag(tapeId: number, isNowFavorite: boolean) {
  if (isNowFavorite) {
    favoriteTapeIds.update((prev) => {
      const i = prev.indexOf(tapeId)
      if (i >= 0) {
        return prev
      }
      return [...prev].concat([tapeId]).sort((a, b) => a - b)
    })
  } else {
    favoriteTapeIds.update((prev) => {
      const i = prev.indexOf(tapeId)
      if (i === -1) {
        return prev
      }
      return prev.slice(0, i).concat(prev.slice(i + 1))
    })
  }
}

isViewer.subscribe((isNowViewer) => {
  if (isNowViewer) {
    fetchFavoriteTapeIds().then(favoriteTapeIds.set).catch((err) => {
      const message = (err instanceof Error) ? err.message : String(err)
      signalError(`Failed to fetch favorite tape IDs: ${message}`)
    })
  } else {
    favoriteTapeIds.set([])
  }
})

export const tapes = derived([catalogListing, broadcastSummary, favoriteTapeIds, isViewer],
  ([$catalogListing, $broadcastSummary, $favoriteTapeIds, $isViewer]) => {
    if ($catalogListing) {
      return buildTapes($catalogListing, $broadcastSummary, $favoriteTapeIds, $isViewer)
    }
    return [] as Tape[]
  },
  [],
)

function buildTapes(catalogListing: CatalogListing, broadcastSummary: BroadcastSummary | null, favoriteTapeIds: number[], isViewer: boolean): Tape[] {
  const tapes = [] as Tape[]
  for (const item of catalogListing.items) {
    tapes.push({
      id: item.id,
      title: item.title,
      year: item.year > 0 ? item.year : undefined,
      runtime: item.runtime > 0 ? item.runtime : undefined,
      contributor: item.contributor,
      color: item.images.length > 0 ? item.images[0].color : '#cccccc',
      thumbnailImage: `${catalogListing.imageHost}/${item.thumbnail}`,
      images: item.images.map((data, i) => ({
        url: `${catalogListing.imageHost}/${data.filename}`,
        alt: getImageDescription(item.id, i, item.images.length),
        width: data.width,
        height: data.height,
        displayRotatedCW: data.rotated,
      })),
      tags: item.tags,
      broadcastIds: broadcastSummary?.broadcastIdsByTapeId[String(item.id)] || [],
      isFavorite: favoriteTapeIds.includes(item.id),
      onToggleFavorite: !isViewer ? null : () => {
        const isNowFavorite = !favoriteTapeIds.includes(item.id)
        setTapeIsFavorite(item.id, isNowFavorite)
          .then(() => {
            updateFavoriteFlag(item.id, isNowFavorite)
          })
          .catch((err) => {
            const message = (err instanceof Error) ? err.message : String(err)
            const desc = isNowFavorite ? `mark tape ${item.id} as a favorite` : `remove favorite flag from tape ${item.id}`
            signalError(`Failed to ${desc}: ${message}`)
          })
      },
    })
  }
  return tapes
}

function getImageDescription(tapeId: number, index: number, numImages: number): string {
  if (numImages <= 2) {
    if (index === 0) return `Cassette image for tape ${tapeId}`
    return `Additional image for tape ${tapeId}`
  }
  if (index === 0) return `Front cover image for tape ${tapeId}`
  if (index === 1) return `Back cover image for tape ${tapeId}`
  if (index === 2) return `Cassette image for tape ${tapeId}`
  return `Additional image for tape ${tapeId}`
}
