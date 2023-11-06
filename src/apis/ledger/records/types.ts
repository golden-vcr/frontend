export type LedgerBalance = {
  totalPoints: number
  availablePoints: number
}

export type LedgerTransactionHistory = {
  items: LedgerTransaction[]
  nextCursor?: string
}

export type LedgerTransactionState = 'pending' | 'accepted' | 'rejected'
export const VALID_TRANSACTION_STATES = ['pending', 'accepted', 'rejected']

export type LedgerTransaction = {
  id: string
  timestamp: Date
  type: string
  state: LedgerTransactionState
  deltaPoints: number
  description: string
}
