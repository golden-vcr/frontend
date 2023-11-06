import { writable } from 'svelte/store'

export const errors = writable<string[]>([])

export function acknowledgeErrors() {
  errors.set([])
}

export function signalError(message: string) {
  errors.update((prev) => [...prev].concat(message))
}
