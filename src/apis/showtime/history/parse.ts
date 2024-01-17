import type { BroadcastSummary, SummarizedBroadcast, Broadcast, Screening } from './types'

export function parseBroadcastSummary(data: unknown): BroadcastSummary {
  if (typeof data !== "object") {
    throw new Error("invalid broadcast summary: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // Summary.broadcasts
  const broadcasts = [] as SummarizedBroadcast[]
  if (!Array.isArray(obj["broadcasts"])) {
    throw new Error("invalid broadcast summary: 'broadcasts' array is required")
  }
  for (let i = 0; i < obj["broadcasts"].length; i++) {
    broadcasts.push(parseSummarizedBroadcast(obj["broadcasts"][i]))
  }

  // Summary.broadcastIdsByTapeId
  if (typeof obj["broadcastIdsByTapeId"] !== "object") {
    throw new Error("invalid broadcast summary: 'broadcastIdsByTapeId' object field is required")
  }
  const broadcastIdsByTapeId = obj["broadcastIdsByTapeId"] as { [key: string]: number[] }
  
  return { broadcasts, broadcastIdsByTapeId }
}

export function parseSummarizedBroadcast(data: unknown): SummarizedBroadcast {
  if (typeof data !== "object") {
    throw new Error("invalid summarized broadcast: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // SummarizedBroadcast.id
  if (typeof obj["id"] !== "number" || obj["id"] <= 0) {
    throw new Error("invalid summarized broadcast: positive 'id' integer field is required")
  }
  const id = obj["id"]

  // SummarizedBroadcast.startedAt
  if (typeof obj["startedAt"] !== "string" || !obj["startedAt"]) {
    throw new Error("invalid summarized broadcast: non-empty 'startedAt' string field is required")
  }
  const startedAt = new Date(obj["startedAt"])
  if (isNaN(startedAt.getTime())) {
    throw new Error("invalid summarized broadcast: 'startedAt' must be a valid timestamp")
  }

  // SummarizedBroadcast.vodUrl
  let vodUrl = ""
  if (obj["vodUrl"] && typeof obj["vodUrl"] === "string") {
    vodUrl = obj["vodUrl"]
  }

  // SummarizedBroadcast.tapeIds
  let tapeIds = [] as number[]
  if (!Array.isArray(obj["tapeIds"])) {
    throw new Error("invalid summarized broadcast: 'tapeIds' array is required")
  }
  for (let i = 0; i < obj["tapeIds"].length; i++) {
    const tapeId = parseInt(obj["tapeIds"][i])
    if (isNaN(tapeId)) {
      throw new Error("invalid summarized broadcast: 'tapeIds' array must contain integers")
    }
    tapeIds.push(tapeId)
  }

  return { id, startedAt, vodUrl, tapeIds }
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

  // Broadcast.vodUrl
  let vodUrl = undefined as string | undefined
  if (typeof obj["vodUrl"] === "string" && obj["vodUrl"] !== "") {
    vodUrl = obj["vodUrl"]
  }

  return { id, startedAt, endedAt, screenings, vodUrl }
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
