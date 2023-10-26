import { writable } from 'svelte/store'
import { auth } from '../auth'

import { fetchLedgerBalance, fetchLedgerTransactionHistory, type LedgerBalance, type LedgerTransaction, type LedgerTransactionState } from './api'

export { type LedgerBalance, type LedgerTransactionHistory, type LedgerTransaction, type LedgerTransactionState } from './api'

// Use a global store to keep track of our balances for the logged-in user, or null if
// we have no logged-in user
type BalanceStore = {
  state: 'unauthenticated'
} | {
  state: 'loading'
  error?: string
} | {
  state: 'loaded'
  value: LedgerBalance
}
export const balance = writable({state: 'unauthenticated'} as BalanceStore)

// Keep track of whether we've loaded ledger state post-login
let isLoggedIn = false

auth.subscribe((value) => {
  if (value.state.loggedIn) {
    if (!isLoggedIn) {
      onLogin()
      isLoggedIn = true
    }
  } else {
    if (isLoggedIn) {
      onLogout()
      isLoggedIn = false
    }
  }
})

function onLogin() {
  balance.set({ state: 'loading' })
  fetchLedgerBalance().then((value) => {
    balance.set({
      state: 'loaded',
      value,
    })
  }).catch((err) => {
    balance.set({
      state: 'loading',
      error: String(err),
    })
  })
}

function onLogout() {
  balance.set({ state: 'unauthenticated' })
}
