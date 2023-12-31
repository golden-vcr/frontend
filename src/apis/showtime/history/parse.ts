import type { BroadcastSummary, Broadcast, Screening, ImageRequest } from './types'

export function parseBroadcastSummary(data: unknown): BroadcastSummary {
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

  // Screening.imageRequests
  const imageRequests = [] as ImageRequest[]
  if (!Array.isArray(obj["imageRequests"])) {
    throw new Error("invalid screening history: 'imageRequests' array is required")
  }
  for (let i = 0; i < obj["imageRequests"].length; i++) {
    imageRequests.push(parseImageRequest(obj["imageRequests"][i]))
  }

  return { tapeId, startedAt, endedAt, imageRequests }
}

function parseImageRequest(data: unknown): ImageRequest {
  if (typeof data !== "object") {
    throw new Error("invalid image request: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // ImageRequest.id
  if (typeof obj["id"] !== "string" || !obj["id"]) {
    throw new Error("invalid image request: non-empty 'id' string field is required")
  }
  const id = obj["id"]

  // ImageRequest.username
  if (typeof obj["username"] !== "string" || !obj["username"]) {
    throw new Error("invalid image request: non-empty 'username' string field is required")
  }
  const username = obj["username"]

  // ImageRequest.subject
  if (typeof obj["subject"] !== "string" || !obj["subject"]) {
    throw new Error("invalid image request: non-empty 'subject' string field is required")
  }
  const subject = obj["subject"]

  return { id, username, subject }
}
