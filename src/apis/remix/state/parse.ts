import type { ClipListing, Clip } from './types'

export function parseClipListing(data: unknown): ClipListing {
  if (typeof data !== "object") {
    throw new Error("invalid clip listing: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // ClipListing.clips
  const clips = [] as Clip[]
  if (!Array.isArray(obj["clips"])) {
    throw new Error("invalid clip listing: 'clips' array is required")
  }
  for (let i = 0; i < obj["clips"].length; i++) {
    clips.push(parseClip(obj["clips"][i]))
  }

  return { clips }
}

function parseClip(data: unknown): Clip {
  if (typeof data !== "object") {
    throw new Error("invalid clip: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // Clip.id
  if (typeof obj["id"] !== "string" || obj["id"] === "") {
    throw new Error("invalid clip: non-empty 'id' field is required")
  }
  const id = obj["id"]

  // Clip.title
  if (typeof obj["title"] !== "string" || obj["title"] === "") {
    throw new Error("invalid clip: non-empty 'title' field is required")
  }
  const title = obj["title"]

  // Clip.duration
  if (typeof obj["duration"] !== "number") {
    throw new Error("invalid clip: numeric 'duration' field is required")
  }
  const duration = obj["duration"]

  // Clip.tapeId
  if (typeof obj["tapeId"] !== "number") {
    throw new Error("invalid clip: numeric 'tapeId' field is required")
  }
  const tapeId = obj["tapeId"]

  return { id, title, duration, tapeId }
}
