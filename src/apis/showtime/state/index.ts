import type { BroadcastState } from './types'
import { parseBroadcastState } from './parse'

export * from './types'

// https://golden-vcr.github.io/showtime/#/streams/getState
export function createBroadcastStateSource(init: { onStateChange: (newState: BroadcastState) => void, onError: (err: Error) => void }): EventSource {
  const source = new EventSource('/api/showtime/state')
  source.addEventListener('error', (ev) => {
    console.error(ev)
  })
  source.addEventListener('message', (ev) => {
    let newState = null as null | BroadcastState
    try {
      newState = parseBroadcastState(JSON.parse(ev.data))
    } catch (err) {
      init.onError((err instanceof Error) ? err : new Error(String(err)))
    }
    if (newState) {
      init.onStateChange(newState)
    }
  })
  return source
}
