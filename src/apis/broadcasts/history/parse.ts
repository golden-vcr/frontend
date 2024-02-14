import type { BroadcastHistory, ScreeningHistory, Broadcast, Screening } from "./types"

export function parseBroadcastHistory(data: unknown): BroadcastHistory {
  if (typeof data !== "object") {
    throw new Error("invalid broadcast history: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // BroadcastHistory.broadcasts
  const broadcasts = [] as Broadcast[]
  if (!Array.isArray(obj["broadcasts"])) {
    throw new Error("invalid broadcast history: 'broadcasts' array is required")
  }
  for (let i = 0; i < obj["broadcasts"].length; i++) {
    broadcasts.push(parseBroadcast(obj["broadcasts"][i]))
  }

  return { broadcasts }
}

export function parseScreeningHistory(data: unknown): ScreeningHistory {
  if (typeof data !== "object") {
    throw new Error("invalid screening history: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // ScreeningHistory.broadcastIdsByTapeId
  if (typeof obj["broadcastIdsByTapeId"] !== "object") {
    throw new Error("invalid broadcast summary: 'broadcastIdsByTapeId' object field is required")
  }
  const broadcastIdsByTapeId = obj["broadcastIdsByTapeId"] as { [key: string]: number[] }

  return { broadcastIdsByTapeId }
}

export function parseBroadcast(data: unknown): Broadcast {
  if (typeof data !== "object") {
    throw new Error("invalid broadcast: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // Broadcast.id
  if (typeof obj["id"] !== "number" || obj["id"] <= 0) {
    throw new Error("invalid broadcast: positive 'id' integer field is required")
  }
  const id = obj["id"]

  // Broadcast.startedAt
  if (typeof obj["startedAt"] !== "string" || !obj["startedAt"]) {
    throw new Error("invalid broadcast: non-empty 'startedAt' string field is required")
  }
  const startedAt = new Date(obj["startedAt"])
  if (isNaN(startedAt.getTime())) {
    throw new Error("invalid broadcast: 'startedAt' must be a valid timestamp")
  }
  
  // Broadcast.endedAt
  if (typeof obj["endedAt"] === "undefined") {
    throw new Error("invalid broadcast: 'endedAt' field must be present")
  }
  let endedAt = null as Date | null
  if (obj["endedAt"] !== null) {
    if (typeof obj["endedAt"] !== "string" || !obj["endedAt"]) {
      throw new Error("invalid broadcast: 'endedAt' field must be a non-empty string if not null")
    }
    endedAt = new Date(obj["endedAt"])
    if (isNaN(endedAt.getTime())) {
      throw new Error("invalid broadcast: 'endedAt' must be a valid timestamp if set")
    }
  }

  // Broadcast.screenings
  const screenings = [] as Screening[]
  if (!Array.isArray(obj["screenings"])) {
    throw new Error("invalid broadcast: 'screenings' array is required")
  }
  for (let i = 0; i < obj["screenings"].length; i++) {
    screenings.push(parseScreening(obj["screenings"][i]))
  }

  return { id, startedAt, endedAt, screenings }
}

function parseScreening(data: unknown): Screening {
  if (typeof data !== "object") {
    throw new Error("invalid screening: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // Screening.id
  if (typeof obj["id"] !== "string" || !obj["id"]) {
    throw new Error("invalid screening: non-empty 'id' string field is required")
  }
  const id = obj["id"]

  // Screening.tapeId
  if (typeof obj["tapeId"] !== "number" || obj["tapeId"] <= 0) {
    throw new Error("invalid screening: positive 'tapeId' integer field is required")
  }
  const tapeId = obj["tapeId"]

  // Screening.startedAt
  if (typeof obj["startedAt"] !== "string" || !obj["startedAt"]) {
    throw new Error("invalid screening: non-empty 'startedAt' string field is required")
  }
  const startedAt = new Date(obj["startedAt"])
  if (isNaN(startedAt.getTime())) {
    throw new Error("invalid screening history: 'startedAt' must be a valid timestamp")
  }
  
  // Screening.endedAt
  if (typeof obj["endedAt"] === "undefined") {
    throw new Error("invalid screening: 'endedAt' field must be present")
  }
  let endedAt = null as Date | null
  if (obj["endedAt"] !== null) {
    if (typeof obj["endedAt"] !== "string" || !obj["endedAt"]) {
      throw new Error("invalid screening: 'endedAt' field must be a non-empty string if not null")
    }
    endedAt = new Date(obj["endedAt"])
    if (isNaN(endedAt.getTime())) {
      throw new Error("invalid screening: 'endedAt' must be a valid timestamp if set")
    }
  }
  
  return { id, tapeId, startedAt, endedAt }
}
