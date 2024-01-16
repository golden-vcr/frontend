<script lang="ts">
  import TapeListItem from './TapeListItem.svelte'

  export let withFilters = true
  export let tapeIds: number[]
  export let onClearFilters: () => void
</script>

<div class="container">
{#if tapeIds.length > 0}
{#each tapeIds as tapeId}
  <TapeListItem {tapeId} />
{/each}
{:else}
  <div class="no-results">
    No tapes found.
    <button on:click={withFilters ? onClearFilters : () => {}}>
      Clear Filters
    </button>
  </div>
{/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 0.675rem;
  }
  .no-results {
    display: flex;
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  @media only screen and (max-width: 696px) {
    .container {
      gap: 0.3rem;
    }
  }
</style>
