import { writable, derived } from 'svelte/store'

import { fetchCatalogListing, type CatalogListing } from '../apis/tapes/catalog'
import { fetchBroadcastSummary, type BroadcastSummary } from '../apis/showtime/history'

import { signalError } from './errors'

export type Tape = {
  id: number
  title: string
  year?: number
  runtime?: number
  color: string
  thumbnailImage: string
  images: TapeImage[]
  tags: string[]
  broadcastIds: number[]
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

export const tapes = derived([catalogListing, broadcastSummary], ([$catalogListing, $broadcastSummary]) => {
  if ($catalogListing) {
    return buildTapes($catalogListing, $broadcastSummary)
  }
  return [] as Tape[]
}, [])

function buildTapes(catalogListing: CatalogListing, broadcastSummary: BroadcastSummary | null): Tape[] {
  const tapes = [] as Tape[]
  for (const item of catalogListing.items) {
    tapes.push({
      id: item.id,
      title: item.title,
      year: item.year > 0 ? item.year : undefined,
      runtime: item.runtime > 0 ? item.runtime : undefined,
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