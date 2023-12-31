import type { BroadcastSummary, Broadcast } from './types'
import { parseBroadcastSummary, parseBroadcast } from './parse'

export * from './types'

export async function fetchBroadcastSummary(): Promise<BroadcastSummary> {
  const url = '/api/showtime/history'
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
  return parseBroadcastSummary(data)
}

export async function fetchBroadcast(broadcastId: number): Promise<Broadcast> {
  const url = `/api/showtime/history/${broadcastId}`
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
  return parseBroadcast(data)
}

export async function fetchImageUrls(imageRequestId: string): Promise<string[]> {
  const url = `/api/showtime/history/images/${imageRequestId}`
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
  if (!Array.isArray(data)) {
    throw new Error(`Got non-array JSON payload from ${url}`)
  }
  return data
}
