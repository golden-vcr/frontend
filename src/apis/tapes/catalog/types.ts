export type CatalogListing = {
  imageHost: string
  items: CatalogItem[]
}

export type CatalogItem = {
  id: number
  title: string
  year: number
  runtime: number
  thumbnail: string
  contributor?: string
  images: GalleryImage[]
  tags: string[]
}

export type GalleryImage = {
  filename: string
  width: number
  height: number
  color: string
  rotated: boolean
}
