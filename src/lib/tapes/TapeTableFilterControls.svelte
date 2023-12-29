<script lang="ts">
  import type { TapeFilterParams, TapeScreeningStatus, TapeFavoriteStatus } from '../../state/tapes'
  import { TAPE_SCREENING_STATUS_VALUES, TAPE_FAVORITE_STATUS_VALUES } from '../../state/tapes'

  export let filterParams: TapeFilterParams
  export let onScreeningStatusChange: (value: TapeScreeningStatus) => void
  export let onFavoriteStatusChange: (value: TapeFavoriteStatus) => void
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
    <div class="separator" />
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
    margin-bottom: 1rem;
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
    font-weight: 500;
    margin-right: 0.5rem;
  }
  input, select {
    font-size: 1rem;
    line-height: 1;
    padding: 0.25rem;
  }
  .separator {
    margin: 0 1rem;
    width: 1px;
    height: 100%;
    background-color: #404040;
  }
  #search {
    flex: 1;
  }
  button {
    flex: 0 0 3rem;
    height: 100%;
    padding: 0;
    line-height: 1;
  }
</style>
