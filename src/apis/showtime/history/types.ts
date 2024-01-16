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
}
