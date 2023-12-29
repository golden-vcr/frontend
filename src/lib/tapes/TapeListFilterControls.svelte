<script lang="ts">
  import type { TapeFilterParams, TapeScreeningStatus, TapeFavoriteStatus, TapeSortCriteria } from '../../state/tapes'
  import { TAPE_SCREENING_STATUS_VALUES, TAPE_FAVORITE_STATUS_VALUES, TAPE_SORT_CRITERIA_VALUES } from '../../state/tapes'

  export let filterParams: TapeFilterParams
  export let onScreeningStatusChange: (value: TapeScreeningStatus) => void
  export let onFavoriteStatusChange: (value: TapeFavoriteStatus) => void
  export let onSortChange: (criteria: TapeSortCriteria, descending: boolean) => void
  export let onSearchChange: (text: string) => void
</script>

<form>
  <fieldset>
    <label for="show-screening-statuses">
      Show:
    </label>
    <select
      id="show-screening-statuses"
      bind:value={filterParams.showScreeningStatus}
      on:change={() => { onScreeningStatusChange(filterParams.showScreeningStatus) }}
    >
{#each TAPE_SCREENING_STATUS_VALUES as status}
      <option value={status}>{status[0].toUpperCase() + status.slice(1)}</option>
{/each}
    </select>
    <select
      id="show-favorite-statuses"
      bind:value={filterParams.showFavoriteStatus}
      on:change={() => { onFavoriteStatusChange(filterParams.showFavoriteStatus) }}
    >
{#each TAPE_FAVORITE_STATUS_VALUES as status}
      <option value={status}>{status[0].toUpperCase() + status.slice(1)}</option>
{/each}
    </select>
  </fieldset>
  <fieldset>
    <label for="sort-by">
      Sort By:
    </label>
    <select
      id="sort-by"
      bind:value={filterParams.sortBy}
      on:change={() => { onSortChange(filterParams.sortBy, filterParams.sortDescending) }}
    >
{#each TAPE_SORT_CRITERIA_VALUES as criteria}
      <option value={criteria}>{criteria === 'id' ? 'ID' : criteria[0].toUpperCase() + criteria.slice(1)}</option>
{/each}
    </select>
    <button
      on:click={(e) => {
        e.preventDefault()
        onSortChange(filterParams.sortBy, !filterParams.sortDescending)
      }}
    >
      {filterParams.sortDescending ? '\u25b2' : '\u25bc'}
    </button>
  </fieldset>
  <fieldset>
    <label for="search">
      Search:
    </label>
    <input
      id="search"
      type="text"
      bind:value={filterParams.searchText}
      on:input={() => onSearchChange(filterParams.searchText)}
      on:change={(e) => { e.preventDefault() }}
      on:submit={(e) => { e.preventDefault() }}
    />
    <button
      disabled={!filterParams.searchText}
      on:click={(e) => {
        e.preventDefault()
        onSearchChange('')
      }}
    >
      {'\u00d7'}
    </button>
  </fieldset>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    border: 0;
    gap: 0.4rem;
    padding: 0.4rem;
    margin-bottom: 0.4rem;
  }
  fieldset {
    display: flex;
    flex-direction: row;
    gap: 0.2rem;
    align-items: center;
    border: 0;
    padding: 0;
  }
  label {
    font-size: 0.875rem;
    font-weight: 500;
    flex: 0 0 7ch;
  }
  input, select {
    flex: 1 0;
    font-size: 1rem;
    line-height: 1;
    padding: 0.25rem;
  }
  button {
    flex: 0 0 3rem;
    height: 100%;
    padding: 0;
    line-height: 1;
  }
</style>
