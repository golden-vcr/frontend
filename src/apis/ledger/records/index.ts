import { authorizedFetch } from '../../../auth'

import type { LedgerBalance, LedgerTransactionHistory, LedgerTransaction } from './types'
import { parseLedgerBalance, parseLedgerTransactionHistory, parseLedgerTransaction } from './parse'

export * from './types'

export async function fetchLedgerBalance(): Promise<LedgerBalance> {
  const url = '/api/ledger/balance'
  const r = await authorizedFetch(url)
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
  return parseLedgerBalance(data)
}

export async function fetchLedgerTransactionHistory(fromCursor?: string): Promise<LedgerTransactionHistory> {
  const url = new URL('/api/ledger/history', window.location.origin)
  if (fromCursor) {
    url.searchParams.set('from', fromCursor)
  }
  const r = await authorizedFetch(url)
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
  return parseLedgerTransactionHistory(data)
}

async function getLedgerNotificationsUrl(): Promise<string> {
  const url = '/api/ledger/notifications'
  const r = await authorizedFetch(url, { method: 'POST' })
  if (!r.ok) {
    let suffix = ''
    try {
      const message = await r.text()
      suffix = `: ${message}`
    } catch (ignored) {
    }
    throw new Error(`Got ${r.status} response from ${url}${suffix}`)
  }
  const data = await r.text()
  return `/api/ledger/notifications?token=${encodeURIComponent(data.trim())}`
}

export async function createLedgerNotificationsSource(init: { onTransaction: (item: LedgerTransaction) => void, onError: (err: Error) => void }): Promise<EventSource> {
  let url = ''
  try {
    url = await getLedgerNotificationsUrl()
  } catch (err) {
    init.onError((err instanceof Error) ? err : new Error(String(err)))
  }

  const source = new EventSource(url)
  source.addEventListener('error', (ev) => {
    console.error(ev)
  })
  source.addEventListener('message', (ev) => {
    let item = null as null | LedgerTransaction
    try {
      item = parseLedgerTransaction(JSON.parse(ev.data))
    } catch (err) {
      init.onError((err instanceof Error) ? err : new Error(String(err)))
    }
    if (item) {
      init.onTransaction(item)
    }
  })
  return source  
}
