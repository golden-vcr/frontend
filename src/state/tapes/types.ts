export type Tape = {
  id: number
  title: string
  year?: number
  runtime?: number
  contributor?: string
  numFavorites: number
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
