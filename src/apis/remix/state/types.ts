export type ClipListing = {
  clips: Clip[]
}

export type Clip = {
  id: string
  title: string
  duration: number
  tapeId: number
}