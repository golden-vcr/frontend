<script lang="ts">
  import { tapes } from '../state/tapes'
  import TapeListItem from './TapeListItem.svelte'

  export let tapeId: number

  $: tape = $tapes.find((x) => x.id === tapeId) || null
</script>

{#if tape}
<TapeListItem {tape} {...$$restProps} />
{:else}
<p>Loading tape {tapeId}...</p>
{/if}
