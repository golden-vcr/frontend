export type BroadcastSummary = {
  broadcastIdsByTapeId: { [key: string]: number[] }
}

export type Broadcast = {
  id: number
  startedAt: Date
  endedAt: Date | null
  screenings: Screening[]
  vodUrl?: string
}

export type Screening = {
  tapeId: number
  startedAt: Date
  endedAt: Date | null
  imageRequests: ImageRequest[]
}

export type ImageRequest = {
  id: string
  username: string
  subject: string
}
