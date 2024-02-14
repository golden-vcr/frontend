export type BroadcastHistory = {
  broadcasts: Broadcast[]
}

export type ScreeningHistory = {
  broadcastIdsByTapeId: { [key: string]: number[] }
}

export type Broadcast = {
  id: number
  startedAt: Date
  endedAt: Date | null
  screenings: Screening[]
}

export type Screening = {
  id: string
  tapeId: number
  startedAt: Date
  endedAt: Date | null
}
