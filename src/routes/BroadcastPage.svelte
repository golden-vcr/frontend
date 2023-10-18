<script lang="ts">
  import { fetchBroadcastHistory } from '../history'
  import { type Tape } from '../tapes/index'

  // TODO: Refactor tape data into a global store; nesting promises is gross
  export let broadcastId: number
  export let tapesPromise: Promise<Tape[]>
  const broadcastPromise = fetchBroadcastHistory(broadcastId)
</script>

<div>
{#await broadcastPromise}
<p style="text-align: center">Loading...</p>
{:then broadcast}
{#await tapesPromise}
<p style="text-align: center">Loading...</p>
{:then tapes}
<p>Broadcast {broadcast.id}:</p>
<ul>
  <li><b>Started at:</b> {broadcast.startedAt.toLocaleString()}</li>
{#if broadcast.endedAt !== null}
  <li><b>Ended at:</b> {broadcast.endedAt.toLocaleString()}</li>
{:else}
  <li><em>Still live!</em></li>
{/if}
{#if broadcast.screenings.length > 0}
  <li>Screened {broadcast.screenings.length} tape{broadcast.screenings.length === 1 ? '' : 's'}:</li>
  <ul>
{#each broadcast.screenings as screening}
    <li>{screening.tapeId}: {tapes.find((x) => x.id === screening.tapeId)?.title || '<unknown tape>'}</li>
{/each}
  </ul>
{:else}
  <li>No tapes screened.</li>
{/if}
</ul>
{:catch tapesError}
<p>{tapesError.toString()}</p>
{/await}
{:catch broadcastError}
<p>{broadcastError.toString()}</p>
{/await}
</div>

<style>
  div {
    padding: 2rem;
  }
</style>