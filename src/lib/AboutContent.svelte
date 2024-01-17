<script lang="ts">
  import { Link } from 'svelte-routing'

  import { broadcastSummary, tapes } from '../state/tapes'

  $: broadcasts = [...$broadcastSummary?.broadcasts || []].toReversed().map((x) => {
    let broadcastTapes = [] as {id: number, thumbnailUrl: string}[]
    for (const tapeId of x.tapeIds) {
      const tape = $tapes.find((x) => x.id === tapeId)
      const thumbnailUrl = tape ? tape.thumbnailImage : ""
      broadcastTapes.push({ id: tapeId, thumbnailUrl })
    }
    return {
      id: x.id,
      startedAt: x.startedAt,
      vodUrl: x.vodUrl,
      tapes: broadcastTapes,
    }
  })
</script>

<p>Follow at: <a href="https://www.twitch.tv/goldenvcr">twitch.tv/GoldenVCR</a></p>
<p>
  For information about contributing tapes to the Golden VCR Library, click
  <Link to="/contributions">here</Link>.
</p>
<div class="broadcast-list">
{#each broadcasts as broadcast}
  <div class="broadcast">
    <Link to={`/broadcasts/${broadcast.id}`}>Broadcast {broadcast.id} - {broadcast.startedAt.toLocaleDateString(window.navigator.language, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</Link>
    <div class="tape-list">
{#each broadcast.tapes as tape}
{#if tape.thumbnailUrl}
      <img
        src={tape.thumbnailUrl}
        loading="lazy"
        alt={`Thumbnail image for tape ${tape.id}`} 
      />
{:else}
      <div class="thumbnail-placeholder" />
{/if}
{/each}
    </div>
  </div>
{/each}
</div>

<style>
  p {
    margin-top: 0;
  }
  .broadcast-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .broadcast {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .tape-list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 4px;
  }
  .tape-list img, .thumbnail-placeholder {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
  }
  .thumbnail-placeholder {
    background-color: #404040;
  }
</style>
