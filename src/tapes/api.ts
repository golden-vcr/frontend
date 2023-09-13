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
  color: string
  runtimeMinutes: number
  thumbnailImageFilename: string
  images: TapeImageData[]
}

export type TapeImageData = {
  filename: string
  width: number
  height: number
  color: string
  rotated: boolean
}

const HEX_COLOR_REGEX = /^#[a-zA-Z0-9]{3}(?:[a-zA-Z0-9]{3})?$/

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

  // TapeListingItem.color
  if (typeof obj["color"] !== "string" || obj["color"] === "") {
    throw new Error("invalid tape: non-empty 'color' field is required")
  }
  const color = obj["color"]

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

  // TapeListingItem.images
  const images = [] as TapeImageData[]
  if (!Array.isArray(obj["images"])) {
    throw new Error("invalid tape: 'images' array is required")
  }
  for (let i = 0; i < obj["images"].length; i++) {
    images.push(parseTapeImageData(obj["images"][i]))
  }

  return { id, title, year, color, runtimeMinutes, thumbnailImageFilename, images }
}

function parseTapeImageData(data: unknown): TapeImageData {
  if (typeof data !== "object") {
    throw new Error("invalid image data: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // TapeImageData.filename
  if (typeof obj["filename"] !== "string" || obj["filename"] === "") {
    throw new Error("invalid image data: non-empty 'filename' field is required")
  }
  const filename = obj["filename"]

  // TapeImageData.width
  if (typeof obj["width"] !== "number") {
    throw new Error("invalid image data: numeric 'width' field is required")
  }
  const width = obj["width"]
  if (width <= 0) {
    throw new Error(`invalid image data: 'width' value must be positive (got ${width})`)
  }

  // TapeImageData.height
  if (typeof obj["height"] !== "number") {
    throw new Error("invalid image data: numeric 'height' field is required")
  }
  const height = obj["height"]
  if (height <= 0) {
    throw new Error(`invalid image data: 'height' value must be positive (got ${height})`)
  }

  // TapeImageData.color
  if (typeof obj["color"] !== "string" || obj["color"] === "") {
    throw new Error("invalid image data: non-empty 'color' field is required")
  }
  if (!obj["color"].match(HEX_COLOR_REGEX)) {
    throw new Error("invalid image data: 'color' must be a hex-formatted RGB value")
  }
  const color = obj["color"]

  // TapeImageData.rotated
  if (typeof obj["rotated"] !== "boolean") {
    throw new Error("invalid image data: boolean 'rotated' field is required")
  }
  const rotated = obj["rotated"]

  return {
    filename,
    width,
    height,
    color,
    rotated,
  }
}
