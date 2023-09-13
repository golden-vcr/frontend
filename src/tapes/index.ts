import { fetchTapeListing, type TapeListing, type TapeListingItem } from "./api"

export type Tape = {
  id: number
  title: string
  color: string
  thumbnailImage: string
  images: TapeImage[]
  year?: number
  runtimeMinutes?: number
}

export type TapeImage = {
  url: string
  alt: string
  width: number
  height: number
  displayRotatedCW: boolean
}

export async function fetchTapes(): Promise<Tape[]> {
  return buildTapes(await fetchTapeListing())
}

function buildTapes(tapeListing: TapeListing): Tape[] {
  const tapes = [] as Tape[]
  for (const item of tapeListing.tapes) {
    tapes.push({
      id: item.id,
      title: item.title,
      color: item.images.length > 0 ? item.images[0].color : '#cccccc',
      thumbnailImage: `${tapeListing.imageHostUrl}/${item.thumbnailImageFilename}`,
      images: item.images.map((data, i) => ({
        url: `${tapeListing.imageHostUrl}/${data.filename}`,
        alt: getImageDescription(item.id, i, item.images.length),
        width: data.width,
        height: data.height,
        displayRotatedCW: data.rotated,
      })),
      year: item.year > 0 ? item.year : undefined,
      runtimeMinutes: item.runtimeMinutes > 0 ? item.runtimeMinutes : undefined,
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
