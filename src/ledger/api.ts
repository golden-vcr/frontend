import { authorizedFetch } from "../auth"

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

export type LedgerBalance = {
  totalPoints: number
  availablePoints: number
}

export type LedgerTransactionHistory = {
  items: LedgerTransaction[]
  nextCursor?: string
}

export type LedgerTransactionState = 'pending' | 'accepted' | 'rejected'
const VALID_TRANSACTION_STATES = ['pending', 'accepted', 'rejected']

export type LedgerTransaction = {
  id: string
  timestamp: Date
  type: string
  state: LedgerTransactionState
  deltaPoints: number
  description: string
}

function parseLedgerBalance(data: unknown): LedgerBalance {
  if (typeof data !== "object") {
    throw new Error("invalid ledger balance: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // LedgerBalance.totalPoints
  if (typeof obj["totalPoints"] !== "number") {
    throw new Error("invalid ledger balance: numeric 'totalPoints' field is required")
  }
  const totalPoints = parseInt(String(obj["totalPoints"]))

  // LedgerBalance.availablePoints
  if (typeof obj["availablePoints"] !== "number") {
    throw new Error("invalid ledger balance: numeric 'availablePoints' field is required")
  }
  const availablePoints = parseInt(String(obj["availablePoints"]))

  return { totalPoints, availablePoints }
}

function parseLedgerTransactionHistory(data: unknown): LedgerTransactionHistory {
  if (typeof data !== "object") {
    throw new Error("invalid ledger transaction history: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // LedgerTransactionHistory.nextCursor
  let nextCursor = undefined as string | undefined
  if (typeof obj["nextCursor"] === "string" && obj["nextCursor"]) {
    nextCursor = obj["nextCursor"]
  }

  // LedgerTransactionHistory.items
  const items = [] as LedgerTransaction[]
  if (!Array.isArray(obj["items"])) {
    throw new Error("invalid ledger transaction history: 'items' array is required")
  }
  for (let i = 0; i < obj["items"].length; i++) {
    items.push(parseLedgerTransaction(obj["items"][i]))
  }

  return { items, nextCursor }
}

function parseLedgerTransaction(data: unknown): LedgerTransaction {
  if (typeof data !== "object") {
    throw new Error("invalid ledger transaction: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // LedgerTransaction.id
  if (typeof obj["id"] !== "string" || obj["id"] === "") {
    throw new Error("invalid ledger transaction: non-empty 'id' field is required")
  }
  const id = obj["id"]

  // LedgerTransaction.timestamp
  if (typeof obj["timestamp"] !== "string" || obj["timestamp"] === "") {
    throw new Error("invalid ledger transaction: non-empty 'timestamp' field is required")
  }
  const timestamp = new Date(obj["timestamp"])
  if (isNaN(timestamp.getTime())) {
    throw new Error("invalid ledger transaction: 'timestamp' value is invalid")
  }

  // LedgerTransaction.type
  if (typeof obj["type"] !== "string" || obj["type"] === "") {
    throw new Error("invalid ledger transaction: non-empty 'type' field is required")
  }
  const type = obj["type"]

  // LedgerTransaction.state
  if (typeof obj["state"] !== "string" || obj["state"] === "") {
    throw new Error("invalid ledger transaction: non-empty 'state' field is required")
  }
  if (!VALID_TRANSACTION_STATES.includes(obj["state"])) {
    throw new Error(`invalid ledger transaction: state '${obj["state"]}' is invalid; expected one of ${VALID_TRANSACTION_STATES.join(', ')}`)
  }
  const state = obj["state"] as LedgerTransactionState

  // LedgerTransaction.deltaPoints
  if (typeof obj["deltaPoints"] !== "number") {
    throw new Error("invalid ledger transaction: numeric 'deltaPoints' field is required")
  }
  const deltaPoints = parseInt(String(obj["deltaPoints"]))

  // LedgerTransaction.description
  if (typeof obj["description"] !== "string" || obj["type"] === "") {
    throw new Error("invalid ledger transaction: non-empty 'description' field is required")
  }
  const description = obj["description"]

  return { id, timestamp, type, state, deltaPoints, description }
}
