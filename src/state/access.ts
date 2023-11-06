import { writable } from 'svelte/store'

import { auth } from '../auth'

export const isViewer = writable(false)

let wasViewer = false

auth.subscribe((value) => {
  const isNowViewer = value.state.loggedIn
  if (wasViewer !== isNowViewer) {
    isViewer.set(isNowViewer)
  }
})
