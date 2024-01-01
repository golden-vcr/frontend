<script lang="ts">
  import type { TapeFilterParams, TapeScreeningStatus, TapeSortCriteria } from '../../state/tapes'

  import TapeTableHeading from './TapeTableHeading.svelte'
  import TapeTableRow from './TapeTableRow.svelte'

  export let filterParams: TapeFilterParams
  export let onSortChange: (criteria: TapeSortCriteria, descending: boolean) => void
  export let onClearFilters: () => void
  export let tapeIds: number[]
  export let highlightedTapeId: number

  function onClickHeading(criteria: TapeSortCriteria) {
    if (filterParams.sortBy === criteria) {
      onSortChange(criteria, !filterParams.sortDescending)
    } else {
      onSortChange(criteria, false)
    }
  }
</script>

{#if tapeIds.length > 0}
<table>
  <tr>
    <TapeTableHeading
      text="ID"
      onClick={() => onClickHeading('id')}
      isSortCriteria={filterParams.sortBy === 'id'}
      isSortedDescending={filterParams.sortDescending}
    />
    <TapeTableHeading
      text="Fav."
      onClick={() => onClickHeading('favorites')}
      isSortCriteria={filterParams.sortBy === 'favorites'}
      isSortedDescending={filterParams.sortDescending}
    />
    <TapeTableHeading
      text="Image"
      onClick={() => onClickHeading('image')}
      isSortCriteria={filterParams.sortBy === 'image'}
      isSortedDescending={filterParams.sortDescending}
    />
    <TapeTableHeading
      text="Title"
      expand
      onClick={() => onClickHeading('title')}
      isSortCriteria={filterParams.sortBy === 'title'}
      isSortedDescending={filterParams.sortDescending}
    />
    <TapeTableHeading
      text="Year"
      onClick={() => onClickHeading('year')}
      isSortCriteria={filterParams.sortBy === 'year'}
      isSortedDescending={filterParams.sortDescending}
    />
    <TapeTableHeading
      text="R/t"
      onClick={() => onClickHeading('runtime')}
      isSortCriteria={filterParams.sortBy === 'runtime'}
      isSortedDescending={filterParams.sortDescending}
    />
    <TapeTableHeading
      text="Broadcasts"
      onClick={() => onClickHeading('broadcasts')}
      isSortCriteria={filterParams.sortBy === 'broadcasts'}
      isSortedDescending={filterParams.sortDescending}
    />
    <TapeTableHeading
      text="Contributor"
      onClick={() => onClickHeading('contributor')}
      isSortCriteria={filterParams.sortBy === 'contributor'}
      isSortedDescending={filterParams.sortDescending}
    />
  </tr>
{#each tapeIds as tapeId}
  <TapeTableRow {tapeId} isHighlighted={highlightedTapeId === tapeId} />
{/each}
</table>
{:else}
<div class="no-results">
  No tapes found.
  <button on:click={onClearFilters}>
    Clear Filters
  </button>
</div>
{/if}

<style>
  table {
    border-collapse: collapse;
  }
  .no-results {
    display: flex;
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
    margin: 1.5rem 20%;
  }
</style>
