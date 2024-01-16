<script lang="ts">
  import { onMount } from 'svelte'

  import TapeListResponsive from './TapeListResponsive.svelte'

  import type { TapeFilterParams, TapeScreeningStatus, TapeFavoriteStatus, TapeSortCriteria } from '../../state/tapes'
  import { tapes, getFilteredTapeIds } from '../../state/tapes'

  export let filterParams: TapeFilterParams
  export let onScreeningStatusChange: (value: TapeScreeningStatus) => void
  export let onFavoriteStatusChange: (value: TapeFavoriteStatus) => void
  export let onSortChange: (criteria: TapeSortCriteria, descending: boolean) => void
  export let onSearchChange: (text: string) => void
  export let onClearFilters: () => void

  $: tapeIds = getFilteredTapeIds($tapes, filterParams)

  // Allow a random tape to be highlighted by hitting a secret hotkey
  $: randomTapeId = tapeIds.length - tapeIds.length
  function chooseRandomTape() {
    randomTapeId = tapeIds.length > 0 ? tapeIds[Math.floor(Math.random() * tapeIds.length)] : 0
    const elem = document.getElementById(`tape-${randomTapeId}`)
    if (elem) {
      elem.scrollIntoView()
      const scrollBottom = window.scrollY + window.innerHeight
      const isScrolledToBottom = scrollBottom >= document.body.scrollHeight
      if (!isScrolledToBottom) {
        window.scrollBy(0, -120)
      }
    }
  }

  onMount(() => {
    const onWindowKeyPress = (ev: KeyboardEvent) => {
      if (ev.key === '\\') {
        chooseRandomTape()
      }
    }
    window.addEventListener('keypress', onWindowKeyPress)
    return () => {
      window.removeEventListener('keypress', onWindowKeyPress)
    }
  })
</script>

<TapeListResponsive
  {tapeIds}
  highlightedTapeId={randomTapeId}
  withFilters
  {filterParams}
  {onScreeningStatusChange}
  {onFavoriteStatusChange}
  {onSortChange}
  {onSearchChange}
  {onClearFilters}
/>
