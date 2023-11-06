import { writable } from 'svelte/store'

import { fetchLedgerBalance } from '../apis/ledger/records'

import { isViewer } from './access'
import { signalError } from './errors'

export type BalanceStore = {
  isLoading: boolean
  numPointsAvailable: number
}

export const balance = writable<BalanceStore>({
  isLoading: false,
  numPointsAvailable: 0,
})

export function refreshBalance() {
  balance.update((prev) => ({
    ...prev,
    isLoading: true,
  }))
  fetchLedgerBalance()
    .then((data) => {
      balance.set({
        isLoading: false,
        numPointsAvailable: data.availablePoints,
      })
    })
    .catch((err) => {
      const message = (err instanceof Error) ? err.message : String(err)
      signalError(`Failed to fetch user's point balance: ${message}`)
    })
}

isViewer.subscribe((isNowViewer) => {
  if (isNowViewer) {
    refreshBalance()
  } else {
    balance.set({
      isLoading: false,
      numPointsAvailable: 0,
    })
  }
})
