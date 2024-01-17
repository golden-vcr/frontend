export type BroadcastSummary = {
  broadcasts: SummarizedBroadcast[]
  broadcastIdsByTapeId: { [key: string]: number[] }
}

export type SummarizedBroadcast = {
  id: number
  startedAt: Date
  vodUrl: string
  tapeIds: number[]
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
