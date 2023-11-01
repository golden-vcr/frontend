export type BroadcastState = {
  isLive: false
} | {
  isLive: true
  broadcastStartedAt: Date
  screeningTapeId?: number
  screeningStartedAt?: Date
}

export function createBroadcastStateSource(init: { onStateChange: (newState: BroadcastState) => void, onError: (err: Error) => void }): EventSource {
  const source = new EventSource('/api/showtime/state')
  source.addEventListener('error', (ev) => {
    console.error(ev)
  })
  source.addEventListener('message', (ev) => {
    let newState = null as null | BroadcastState
    try {
      newState = parseBroadcastState(JSON.parse(ev.data))
    } catch (err) {
      init.onError((err instanceof Error) ? err : new Error(String(err)))
    }
    if (newState) {
      init.onStateChange(newState)
    }
  })
  return source
}

function parseBroadcastState(data: unknown): BroadcastState {
  if (typeof data !== "object") {
    throw new Error("invalid broadcast state: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // BroadcastState.isLive
  if (typeof obj["isLive"] !== "boolean") {
    throw new Error("invalid broadcast state: boolean 'isLive' field is required")
  }
  const isLive = obj["isLive"]
  if (!isLive) {
    return { isLive }
  }

  // BroadcastState.broadcastStartedAt
  if (typeof obj["broadcastStartedAt"] !== "string" || !obj["broadcastStartedAt"]) {
    throw new Error("invalid live broadcast state: string 'broadcastStartedAt' field is required")
  }
  const broadcastStartedAt = new Date(obj["broadcastStartedAt"])
  if (isNaN(broadcastStartedAt.getTime()) || broadcastStartedAt.getFullYear() <= 1970) {
    throw new Error("invalid live broadcast state: 'broadcastStartedAt' must be a valid timestamp")
  }

  // BroadcastState.screeningTapeId
  let screeningTapeId = undefined as number | undefined
  if (typeof obj["screeningTapeId"] !== "undefined") {
    if (typeof obj["screeningTapeId"] !== "number" || obj["screeningTapeId"] <= 0) {
      throw new Error("invalid live broadcast state: 'screeningTapeId' must be a positive integer if set")
    }
    screeningTapeId = parseInt(String(obj["screeningTapeId"]))
  }

  // BroadcastState.screeningStartedAt
  let screeningStartedAt = undefined as Date | undefined
  if (typeof obj["screeningStartedAt"] !== "undefined") {
    if (typeof obj["screeningStartedAt"] !== "string" || !obj["screeningStartedAt"]) {
      throw new Error("invalid live broadcast state: 'screeningStartedAt' must be a non-empty string if set")
    }
    screeningStartedAt = new Date(obj["screeningStartedAt"])
    if (isNaN(screeningStartedAt.getTime()) || screeningStartedAt.getFullYear() <= 1970) {
      throw new Error("invalid live broadcast state: 'screeningStartedAt' must be a valid timestamp if set")
    }
  }

  const hasTapeId = screeningTapeId !== undefined
  const hasStartTime = screeningStartedAt !== undefined
  if (hasTapeId !== hasStartTime) {
    throw new Error("invalid live broadcast state: both 'screeningTapeId' and 'screeningStartedAt' must be supplied together")
  }

  return { isLive, broadcastStartedAt, screeningTapeId, screeningStartedAt }
}
