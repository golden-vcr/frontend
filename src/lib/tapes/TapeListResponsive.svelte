<script lang="ts">
  import TapeTable from './TapeTable.svelte'
  import TapeTableFilterControls from './TapeTableFilterControls.svelte'
  import TapeList from './TapeList.svelte'
  import TapeListFilterControls from './TapeListFilterControls.svelte'

  import type { TapeFilterParams, TapeScreeningStatus, TapeFavoriteStatus, TapeSortCriteria } from '../../state/tapes'

  export let tapeIds: number[]
  export let highlightedTapeId = -1
  export let withFilters = true
  
  export let filterParams: TapeFilterParams
  export let onScreeningStatusChange: (value: TapeScreeningStatus) => void
  export let onFavoriteStatusChange: (value: TapeFavoriteStatus) => void
  export let onSortChange: (criteria: TapeSortCriteria, descending: boolean) => void
  export let onSearchChange: (text: string) => void
  export let onClearFilters: () => void
</script>

<div class="container">
  <div class="wide">
{#if withFilters}
    <TapeTableFilterControls
      {filterParams}
      {onScreeningStatusChange}
      {onFavoriteStatusChange}
      {onSearchChange}
    />
{/if}
    <TapeTable
      {withFilters}
      {filterParams}
      {onSortChange}
      {onClearFilters}
      {tapeIds}
      {highlightedTapeId}
    />
  </div>
  <div class="narrow">
{#if withFilters}
    <TapeListFilterControls
      {filterParams}
      {onScreeningStatusChange}
      {onFavoriteStatusChange}
      {onSortChange}
      {onSearchChange}
    />
{/if}
    <TapeList
      {withFilters}
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
