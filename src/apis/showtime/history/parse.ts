import type { Summary, Broadcast, Screening } from './types'

export function parseSummary(data: unknown): Summary {
  if (typeof data !== "object") {
    throw new Error("invalid broadcast summary: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // Summary.broadcastIdsByTapeId
  if (typeof obj["broadcastIdsByTapeId"] !== "object") {
    throw new Error("invalid broadcast summary: 'broadcastIdsByTapeId' object field is required")
  }
  const broadcastIdsByTapeId = obj["broadcastIdsByTapeId"] as { [key: string]: number[] }
  
  return { broadcastIdsByTapeId }
}

export function parseBroadcast(data: unknown): Broadcast {
  if (typeof data !== "object") {
    throw new Error("invalid broadcast history: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // Broadcast.id
  if (typeof obj["id"] !== "number" || obj["id"] <= 0) {
    throw new Error("invalid broadcast history: positive 'id' integer field is required")
  }
  const id = obj["id"]

  // Broadcast.startedAt
  if (typeof obj["startedAt"] !== "string" || !obj["startedAt"]) {
    throw new Error("invalid broadcast history: non-empty 'startedAt' string field is required")
  }
  const startedAt = new Date(obj["startedAt"])
  if (isNaN(startedAt.getTime())) {
    throw new Error("invalid broadcast history: 'startedAt' must be a valid timestamp")
  }
  
  // Broadcast.endedAt
  if (typeof obj["endedAt"] === "undefined") {
    throw new Error("invalid broadcast history: 'endedAt' field must be present")
  }
  let endedAt = null as Date | null
  if (obj["endedAt"] !== null) {
    if (typeof obj["endedAt"] !== "string" || !obj["endedAt"]) {
      throw new Error("invalid broadcast history: 'endedAt' field must be a non-empty string if not null")
    }
    endedAt = new Date(obj["endedAt"])
    if (isNaN(endedAt.getTime())) {
      throw new Error("invalid broadcast history: 'endedAt' must be a valid timestamp if set")
    }
  }

  // Broadcast.screenings
  const screenings = [] as Screening[]
  if (!Array.isArray(obj["screenings"])) {
    throw new Error("invalid broadcast history: 'screenings' array is required")
  }
  for (let i = 0; i < obj["screenings"].length; i++) {
    screenings.push(parseScreening(obj["screenings"][i]))
  }

  return { id, startedAt, endedAt, screenings }
}

function parseScreening(data: unknown): Screening {
  if (typeof data !== "object") {
    throw new Error("invalid screening history: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // Screening.tapeId
  if (typeof obj["tapeId"] !== "number" || obj["tapeId"] <= 0) {
    throw new Error("invalid screening history: positive 'tapeId' integer field is required")
  }
  const tapeId = obj["tapeId"]

  // Screening.startedAt
  if (typeof obj["startedAt"] !== "string" || !obj["startedAt"]) {
    throw new Error("invalid screening history: non-empty 'startedAt' string field is required")
  }
  const startedAt = new Date(obj["startedAt"])
  if (isNaN(startedAt.getTime())) {
    throw new Error("invalid screening history: 'startedAt' must be a valid timestamp")
  }
  
  // Screening.endedAt
  if (typeof obj["endedAt"] === "undefined") {
    throw new Error("invalid screening history: 'endedAt' field must be present")
  }
  let endedAt = null as Date | null
  if (obj["endedAt"] !== null) {
    if (typeof obj["endedAt"] !== "string" || !obj["endedAt"]) {
      throw new Error("invalid screening history: 'endedAt' field must be a non-empty string if not null")
    }
    endedAt = new Date(obj["endedAt"])
    if (isNaN(endedAt.getTime())) {
      throw new Error("invalid screening history: 'endedAt' must be a valid timestamp if set")
    }
  }

  return { tapeId, startedAt, endedAt }
}
