<script lang="ts">
  import { tapes } from '../state/tapes'
  import TapeListItem from './TapeListItem.svelte'

  export let tapeId: number

  $: tape = $tapes.find((x) => x.id === tapeId) || null
</script>

{#if tape}
<div class="container" style={`border-color: ${tape.color}`}>
  <TapeListItem tape={tape}>
</div>
{:else}
<p>Loading tape {tapeId}...</p>
{/if}

<style>
  .container {
    border: 1px solid;
    border-left: 8px solid;
    padding: 1rem;
    background-color: #181818;
  }
</style>
