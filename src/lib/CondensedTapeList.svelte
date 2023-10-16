<script lang="ts">
  import CondensedTapeListItem from './CondensedTapeListItem.svelte'

  import { type Tape } from '../tapes'
  export let tapes: Tape[]
</script>

<div class="container">
{#each tapes as tape}
  <CondensedTapeListItem {tape} />
{/each}
</div>

<style>
  .container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    padding: 0.375rem;
  }
</style>
