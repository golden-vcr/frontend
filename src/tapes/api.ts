export async function fetchTapeListing(): Promise<TapeListing> {
  const url = '/api/tapes'
  const r = await fetch(url)
  if (!r.ok) {
    let suffix = ''
    try {
      const message = await r.text()
      suffix = `: ${message}`
    } catch (ignored) {
    }
    throw new Error(`Got ${r.status} response from ${url}${suffix}`)
  }
  const data = await r.json()
  return parseTapeListing(data)
}

export type TapeListing = {
  tapes: TapeListingItem[]
  imageHostUrl: string
}

export type TapeListingItem = {
  id: number
  title: string
  year: number
  runtimeMinutes: number
  thumbnailImageFilename: string
  imageFilenames: string[]
}

function parseTapeListing(data: unknown): TapeListing {
  if (typeof data !== "object") {
    throw new Error("invalid tape listing: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // TapeListing.tapes
  if (!Array.isArray(obj["tapes"])) {
    throw new Error("invalid tape listing: 'tapes' array is required")
  }
  const tapes = [] as TapeListingItem[]
  for (const tapeData of obj["tapes"]) {
    tapes.push(parseTapeListingItem(tapeData))
  }

  // TapeListing.imageHostUrl
  if (typeof obj["imageHostUrl"] !== "string" || obj["imageHostUrl"] === "") {
    throw new Error("invalid tape: non-empty 'imageHostUrl' field is required")
  }
  const imageHostUrl = obj["imageHostUrl"]

  return { tapes, imageHostUrl }
}

function parseTapeListingItem(data: unknown): TapeListingItem {
  if (typeof data !== "object") {
    throw new Error("invalid tape: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // TapeListingItem.id
  if (typeof obj["id"] !== "number") {
    throw new Error("invalid tape: numeric 'id' field is required")
  }
  const id = Math.trunc(obj["id"]);
  if (id <= 0) { 
    throw new Error("invalid tape: 'id' value must be greater than zero")
  }

  // TapeListingItem.title
  if (typeof obj["title"] !== "string" || obj["title"] === "") {
    throw new Error("invalid tape: non-empty 'title' field is required")
  }
  const title = obj["title"]

  // TapeListingItem.year
  if (typeof obj["year"] !== "number") {
    throw new Error("invalid tape: numeric 'year' field is required")
  }
  const year = obj["year"]

  // TapeListingItem.runtimeMinutes
  if (typeof obj["runtimeMinutes"] !== "number") {
    throw new Error("invalid tape: numeric 'runtimeMinutes' field is required")
  }
  const runtimeMinutes = obj["runtimeMinutes"]

  // TapeListingItem.thumbnailImageFilename
  if (typeof obj["thumbnailImageFilename"] !== "string" || obj["thumbnailImageFilename"] === "") {
    throw new Error("invalid tape: non-empty 'thumbnailImageFilename' field is required")
  }
  const thumbnailImageFilename = obj["thumbnailImageFilename"]

  // TapeListingItem.imageFilenames
  const imageFilenames = [] as string[]
  if (!Array.isArray(obj["imageFilenames"])) {
    throw new Error("invalid tape: 'imageFilenames' array is required")
  }
  for (let i = 0; i < obj["imageFilenames"].length; i++) {
    const filename = obj["imageFilenames"][i]
    if (typeof filename !== "string" || filename === "") {
      throw new Error(`invalid tape: 'imageFilenames' array item at index ${i} must be a non-empty string`)
    }
    imageFilenames.push(filename)
  }

  return { id, title, year, runtimeMinutes, thumbnailImageFilename, imageFilenames }
}
