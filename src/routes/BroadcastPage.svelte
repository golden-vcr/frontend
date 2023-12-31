<script lang="ts">
  import { fetchBroadcast } from '../apis/showtime/history'

  import TapeListItemLoader from '../lib/TapeListItemLoader.svelte'
  import ImageRequestList from '../lib/ImageRequestList.svelte'

  export let broadcastId: number
  const promise = fetchBroadcast(broadcastId)

  let selectedImageRequestId = ''
  function showImageRequest(id: string) {
    selectedImageRequestId = id
  }
  function closeImageRequest() {
    selectedImageRequestId = ''
  }

  function formatDuration(from: Date, to: Date): string {
    const deltaMs = to.getTime() - from.getTime()
    const totalSeconds = Math.round(deltaMs / 1000)
    if (totalSeconds < 60) {
      return `${totalSeconds} seconds`
    }
    const totalMinutes = Math.round(totalSeconds / 60)  
    if (totalMinutes < 60) {
      return `${totalMinutes} minutes`
    }
    const h = Math.trunc(totalMinutes / 60)
    const m = totalMinutes - (h * 60)
    if (m) {
      return `${h} hours, ${m} minutes`
    }
    return `${h} hours`
  }
</script>

<div>
{#await promise}
<p style="text-align: center">Loading...</p>
{:then broadcast}
<h1>Broadcast {broadcast.id} - {broadcast.startedAt.toLocaleDateString(window.navigator.language, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</h1>

<div class="summary-info">
{#if broadcast.endedAt !== null}
  <p>Streamed for {formatDuration(broadcast.startedAt, broadcast.endedAt)}.</p>
{:else}
  <p>Live since {broadcast.startedAt.toLocaleTimeString()}.</p>
{/if}

{#if broadcast.vodUrl}
  <p class="vod-link">VOD: <a href={broadcast.vodUrl} target="_blank">{broadcast.vodUrl}</a></p>
{/if}
</div>

{#if broadcast.screenings.length === 0}
<p>No tapes screened.</p>
{:else}
{#each broadcast.screenings as screening}
<TapeListItemLoader tapeId={screening.tapeId} withFrame />
<ImageRequestList requests={screening.imageRequests} />
{/each}
{/if}

{:catch error}
<p>{error.toString()}</p>
{/await}
</div>

<style>
  h1 {
    font-size: 1.75rem;
    line-height: 1.0;
    margin: 0;
  }
  .summary-info {
    margin: 1em;
  }
  .summary-info p {
    margin-top: 0;
    margin-bottom: 0;
  }
</style>