import type { BroadcastHistory, ScreeningHistory, Broadcast } from './types'
import { parseBroadcastHistory, parseScreeningHistory, parseBroadcast } from './parse'

export * from './types'

export async function fetchBroadcastHistory(beforeBroadcastId?: number): Promise<BroadcastHistory> {
  const url = new URL('/api/broadcasts/history', window.location.origin)
  if (!!beforeBroadcastId) {
    url.searchParams.set('before', String(beforeBroadcastId))
  }
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
  return parseBroadcastHistory(data)
}

export async function fetchScreeningHistory(): Promise<ScreeningHistory> {
  const url = `/api/broadcasts/screening-history`
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
  return parseScreeningHistory(data)
}

export async function fetchBroadcast(broadcastId: number): Promise<Broadcast> {
  const url = `/api/broadcasts/history/${broadcastId}`
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
