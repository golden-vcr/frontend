import type { FavoriteTapeSet } from './types'

export function parseFavoriteTapeSet(data: unknown): FavoriteTapeSet {
  if (typeof data !== "object") {
    throw new Error("invalid favorite tape set: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // FavoriteTapeSet.tapeIds
  const tapeIds = [] as number[]
  if (!Array.isArray(obj["tapeIds"])) {
    throw new Error("invalid favorite tape set: 'tapeIds' array is required")
  }
  for (let i = 0; i < obj["tapeIds"].length; i++) {
    const tapeId = obj["tapeIds"][i]
    if (typeof tapeId !== "number") {
      throw new Error(`invalid favorite tape set: 'tapeIds' item at index ${i} must be a number`)
    }
    tapeIds.push(tapeId)
  }

  return { tapeIds }
}
