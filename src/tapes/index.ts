import { fetchCatalogListing, type CatalogListing } from "./api"

export type Tape = {
  id: number
  title: string
  year?: number
  runtime?: number
  color: string
  thumbnailImage: string
  images: TapeImage[]
  tags: string[]
}

export type TapeImage = {
  url: string
  alt: string
  width: number
  height: number
  displayRotatedCW: boolean
}

export async function fetchTapes(): Promise<Tape[]> {
  return buildTapes(await fetchCatalogListing())
}

function buildTapes(catalogListing: CatalogListing): Tape[] {
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
