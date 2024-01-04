<script lang="ts">
  import TapesContent from '../lib/tapes/TapesContent.svelte'
  import type { TapeFilterParams, TapeScreeningStatus, TapeFavoriteStatus, TapeSortCriteria } from '../state/tapes'
  import { TAPE_FAVORITE_STATUS_VALUES, TAPE_SCREENING_STATUS_VALUES, TAPE_SORT_CRITERIA_VALUES } from '../state/tapes'
    import ProfilePage from './ProfilePage.svelte';

  function parseFilterParamsFromURL(search: string): TapeFilterParams {
    let result = {
      showScreeningStatus: 'all',
      showFavoriteStatus: 'all',
      searchText: '',
      sortBy: 'id',
      sortDescending: false,
    } as TapeFilterParams
    const p = new URLSearchParams(search)
    const screeningStatusStr = p.get('screeningStatus') || p.get('show')
    if (screeningStatusStr && TAPE_SCREENING_STATUS_VALUES.includes(screeningStatusStr as TapeScreeningStatus)) {
      result.showScreeningStatus = screeningStatusStr as TapeScreeningStatus
    }
    const favoriteStatusStr = p.get('favoriteStatus')
    if (favoriteStatusStr && TAPE_FAVORITE_STATUS_VALUES.includes(favoriteStatusStr as TapeFavoriteStatus)) {
      result.showFavoriteStatus = favoriteStatusStr as TapeFavoriteStatus
    }
    const searchStr = p.get('search')
    if (searchStr) {
      result.searchText = searchStr
    }
    const sortByStr = p.get('sortBy')
    if (sortByStr && TAPE_SORT_CRITERIA_VALUES.includes(sortByStr as TapeSortCriteria)) {
      result.sortBy = sortByStr as TapeSortCriteria
    }
    const descStr = p.get('desc')
    if (descStr && !['0', 'false', 'f', 'no'].includes(descStr)) {
      result.sortDescending = true
    }
    const minStr = p.get('min')
    if (minStr) {
      const minId = parseInt(minStr)
      if (!isNaN(minId) && minId > 0) {
        result.minTapeId = minId
      }
    }
    const maxStr = p.get('max')
    if (maxStr) {
      const maxId = parseInt(maxStr)
      if (!isNaN(maxId) && maxId > 0) {
        result.maxTapeId = maxId
      }
    }
    return result
  }

  function buildSearchParams(params: TapeFilterParams): string {
    const p = new URLSearchParams()
    if (params.showScreeningStatus !== 'all') {
      p.set('screeningStatus', params.showScreeningStatus)
    }
    if (params.showFavoriteStatus !== 'all') {
      p.set('favoriteStatus', params.showFavoriteStatus)
    }
    if (params.searchText) {
      p.set('search', params.searchText)
    }
    if (params.sortBy !== 'id') {
      p.set('sortBy', params.sortBy)
    }
    if (params.sortDescending) {
      p.set('desc', '1')
    }
    if (params.minTapeId && params.minTapeId > 0) {
      p.set('min', `${params.minTapeId}`)
    }
    if (params.maxTapeId && params.maxTapeId > 0) {
      p.set('max', `${params.maxTapeId}`)
    }
    return p.toString()
  }

  let filterParams = parseFilterParamsFromURL(window.location.search)

  function updateLocation() {
    const url = new URL(window.location.href)
    url.search = buildSearchParams(filterParams)
    window.history.pushState({}, '', url.toString())
  }

  function onScreeningStatusChange(status: TapeScreeningStatus) {
    filterParams.showScreeningStatus = status
    updateLocation()
  }

  function onFavoriteStatusChange(status: TapeFavoriteStatus) {
    filterParams.showFavoriteStatus = status
    updateLocation()
  }

  function onSortChange(criteria: TapeSortCriteria, descending: boolean) {
    filterParams.sortBy = criteria
    filterParams.sortDescending = descending
    updateLocation()
  }

  let searchDebounceTimer = null as ReturnType<typeof setTimeout> | null
  function onSearchChange(text: string) {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer)
      searchDebounceTimer = null
    }

    if (!text) {
      filterParams.searchText = ''
      updateLocation()
      return
    }

    searchDebounceTimer = setTimeout(() => {
      filterParams.searchText = text
      updateLocation()
    }, 150)
  }

  function onClearFilters() {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer)
      searchDebounceTimer = null
    }
    filterParams.showScreeningStatus = 'all'
    filterParams.showFavoriteStatus = 'all'
    filterParams.searchText = ''
    filterParams.sortBy = 'id'
    filterParams.sortDescending = false
    filterParams.minTapeId = undefined
    filterParams.maxTapeId = undefined
    updateLocation()
  }
</script>

<TapesContent
  {filterParams}
  {onScreeningStatusChange}
  {onFavoriteStatusChange}
  {onSortChange}
  {onSearchChange}
  {onClearFilters}
/>
