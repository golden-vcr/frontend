<script lang="ts">
  import TapeTable from './TapeTable.svelte'
  import TapeTableFilterControls from './TapeTableFilterControls.svelte'
  import TapeList from './TapeList.svelte'
  import TapeListFilterControls from './TapeListFilterControls.svelte'

  import type { TapeFilterParams, TapeScreeningStatus, TapeFavoriteStatus, TapeSortCriteria } from '../../state/tapes'
  import { tapes, getFilteredTapeIds } from '../../state/tapes'

  export let filterParams: TapeFilterParams
  export let onScreeningStatusChange: (value: TapeScreeningStatus) => void
  export let onFavoriteStatusChange: (value: TapeFavoriteStatus) => void
  export let onSortChange: (criteria: TapeSortCriteria, descending: boolean) => void
  export let onSearchChange: (text: string) => void
  export let onClearFilters: () => void

  $: tapeIds = getFilteredTapeIds($tapes, filterParams)
</script>

<div class="container">
  <div class="wide">
    <TapeTableFilterControls
      {filterParams}
      {onScreeningStatusChange}
      {onFavoriteStatusChange}
      {onSearchChange}
    />
    <TapeTable
      {filterParams}
      {onSortChange}
      {onClearFilters}
      {tapeIds}
    />
  </div>
  <div class="narrow">
    <TapeListFilterControls
      {filterParams}
      {onScreeningStatusChange}
      {onFavoriteStatusChange}
      {onSortChange}
      {onSearchChange}
    />
    <TapeList
      {tapeIds}
      {onClearFilters}
    />
  </div>
</div>

<style>
  .narrow {
    display: none;
  }
  @media only screen and (max-width: 696px) {
    .wide {
      display: none;
    }
    .narrow {
      display: inline;
    }
  }
</style>