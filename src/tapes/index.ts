import { fetchTapeListing, type TapeListing, type TapeListingItem } from "./api"

export type Tape = {
  id: number
  title: string
  thumbnailImage: string
  images: string[]
  year?: number
  runtimeMinutes?: number
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
      thumbnailImage: `${tapeListing.imageHostUrl}/${item.thumbnailImageFilename}`,
      images: item.imageFilenames.map((filename) => `${tapeListing.imageHostUrl}/${filename}`),
      year: item.year > 0 ? item.year : undefined,
      runtimeMinutes: item.runtimeMinutes > 0 ? item.runtimeMinutes : undefined,
    })
  }
  return tapes
}
