import { writable } from 'svelte/store'

import { fetchImageUrls } from '../apis/showtime/history'

type ImageRequestLookup = { [key: string]: string[] }

export const images = writable<ImageRequestLookup>({})

export function requestImageUrls(imageRequestId: string) {
  fetchImageUrls(imageRequestId)
    .then((urls) => {
      images.update((prev) => ({
        ...prev,
        [imageRequestId]: urls,
      }))
    })
}
