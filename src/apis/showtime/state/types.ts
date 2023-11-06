export type BroadcastState = {
  isLive: false
} | {
  isLive: true
  broadcastStartedAt: Date
  screeningTapeId?: number
  screeningStartedAt?: Date
}
