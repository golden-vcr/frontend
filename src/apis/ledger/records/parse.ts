import type { LedgerBalance, LedgerTransactionHistory, LedgerTransaction, LedgerTransactionState} from './types'
import { VALID_TRANSACTION_STATES } from './types'

export function parseLedgerBalance(data: unknown): LedgerBalance {
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

export function parseLedgerTransactionHistory(data: unknown): LedgerTransactionHistory {
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

export function parseLedgerTransaction(data: unknown): LedgerTransaction {
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
