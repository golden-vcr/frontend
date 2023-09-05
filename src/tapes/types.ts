export type Tape = {
  id: number
  title: string
  year?: number
  runtimeMinutes?: number
}

export function parseTape(data: unknown): Tape {
  if (typeof data !== "object") {
    throw new Error("invalid tape: data is not an object")
  }
  const obj = data as { [key: string]: unknown }
  
  if (typeof obj["id"] !== "number") {
    throw new Error("invalid tape: numeric 'id' field is required")
  }
  const id = Math.trunc(obj["id"]);
  if (id <= 0) { 
    throw new Error("invalid tape: 'id' value must be greater than zero")
  }

  if (typeof obj["title"] !== "string" || obj["title"] === "") {
    throw new Error("invalid tape: non-empty 'title' field is required")
  }
  const title = obj["title"]

  if (typeof obj["year"] !== "number") {
    throw new Error("invalid tape: numeric 'year' field is required")
  }
  const yearAsInt = Math.trunc(obj["year"])
  const year = yearAsInt > 0 ? yearAsInt : undefined

  if (typeof obj["runtime"] !== "number") {
    throw new Error("invalid tape: numeric 'runtime' field is required")
  }
  const runtimeAsInt = Math.trunc(obj["runtime"])
  const runtimeMinutes = runtimeAsInt > 0 ? runtimeAsInt : undefined

  return { id, title, year, runtimeMinutes }
}
