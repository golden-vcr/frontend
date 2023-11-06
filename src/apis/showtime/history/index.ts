import type { Summary, Broadcast } from './types'
import { parseSummary, parseBroadcast } from './parse'

export * from './types'

export async function fetchBroadcastSummary(): Promise<Summary> {
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
  return parseSummary(data)
}

export async function fetchBroadcastHistory(broadcastId: number): Promise<Broadcast> {
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
