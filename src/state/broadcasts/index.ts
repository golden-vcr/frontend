import { writable, derived, get } from 'svelte/store'

import { fetchBroadcastHistory, fetchScreeningHistory, type BroadcastHistory, type Broadcast, type ScreeningHistory } from '../../apis/broadcasts/history'

import { signalError } from '../errors'

export const broadcasts = writable([] as Broadcast[])
export const broadcastIdsByTapeId = writable({} as { [key: string]: number[] })

const isFetchingBroadcasts = writable(true)
const minBroadcastId = derived([broadcasts], ([$broadcasts]) => {
    const minId = $broadcasts.reduce((acc, x) => x.id < acc ? x.id : acc, 2147483647)
    return minId === 2147483647 ? null : minId
})

export const canLoadMoreBroadcasts = derived([isFetchingBroadcasts, minBroadcastId], ([$isFetchingBroadcasts, $minBroadcastId]) => {
    return !$isFetchingBroadcasts && $minBroadcastId !== null && $minBroadcastId > 1
})

function updateBroadcasts(history: BroadcastHistory) {
    const newOrUpdatedIds = history.broadcasts.map((x) => x.id)
    broadcasts.update((prev) => {
        const stale = prev.filter((x) => !newOrUpdatedIds.includes(x.id))
        return stale.concat(history.broadcasts).sort((a, b) => b.id - a.id)
    })
    isFetchingBroadcasts.set(false)
}

export function loadMoreBroadcasts() {
    const beforeBroadcastId = get(minBroadcastId)
    if (beforeBroadcastId) {
        isFetchingBroadcasts.set(true)
        fetchBroadcastHistory(beforeBroadcastId).then(updateBroadcasts).catch((err) => {
            const message = (err instanceof Error) ? err.message : String(err)
            signalError(`Failed to fetch additional broadcast history: ${message}`)
        })
    }
}

fetchBroadcastHistory().then(updateBroadcasts).catch((err) => {
    const message = (err instanceof Error) ? err.message : String(err)
    signalError(`Failed to fetch initial broadcast history: ${message}`)
})

fetchScreeningHistory().then((value) => {
    broadcastIdsByTapeId.set(value.broadcastIdsByTapeId)
}).catch((err) => {
    const message = (err instanceof Error) ? err.message : String(err)
    signalError(`Failed to fetch screening history: ${message}`)
})
