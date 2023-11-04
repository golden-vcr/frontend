<script lang="ts">
  import { fetchBroadcastHistory } from '../history'
  import { tapes } from '../tapes/index'

  export let broadcastId: number
  const promise = fetchBroadcastHistory(broadcastId)
</script>

<div>
{#await promise}
<p style="text-align: center">Loading...</p>
{:then broadcast}
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
    <li>{screening.tapeId}: {$tapes.tapes.find((x) => x.id === screening.tapeId)?.title || '<unknown tape>'}</li>
{/each}
  </ul>
{:else}
  <li>No tapes screened.</li>
{/if}
</ul>
{:catch error}
<p>{error.toString()}</p>
{/await}
</div>
