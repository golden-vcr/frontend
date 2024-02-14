<script lang="ts">
  import { derived, type Readable } from 'svelte/store'
  import { Link } from 'svelte-routing'

  import { tapes, type Tape } from '../state/tapes'
  import { broadcasts, canLoadMoreBroadcasts, loadMoreBroadcasts } from '../state/broadcasts'
  import { type Broadcast } from '../apis/broadcasts/history'

  type BroadcastWithTapes = Broadcast & { tapes: Tape[] }

  const broadcastsWithTapes: Readable<BroadcastWithTapes[]> = derived([tapes, broadcasts], ([$tapes, $broadcasts]) => {
    return $broadcasts.map((broadcast) => {
      const tapes = [] as Tape[]
      for (const screening of broadcast.screenings) {
        const tape = $tapes.find((x) => x.id === screening.tapeId)
        if (tape) {
          tapes.push(tape)
        }
      }
      return { ...broadcast, tapes }
    })
  })
</script>

<p>Follow at: <a href="https://www.twitch.tv/goldenvcr">twitch.tv/GoldenVCR</a></p>
<p>
  For information about contributing tapes to the Golden VCR Library, click
  <Link to="/contributions">here</Link>.
</p>
<div class="broadcast-list">
{#each $broadcastsWithTapes as broadcast}
  <div class="broadcast">
    <Link to={`/broadcasts/${broadcast.id}`}>Broadcast {broadcast.id} - {broadcast.startedAt.toLocaleDateString(window.navigator.language, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</Link>
    <div class="tape-list">
{#each broadcast.tapes as tape}
{#if tape.thumbnailImage}
      <img
        src={tape.thumbnailImage}
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
{#if $canLoadMoreBroadcasts}
  <button on:click={loadMoreBroadcasts}>Load more...</button>
{/if}
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
  button {
    margin: 0 20%;
    margin-top: 0.5rem;
  }
</style>
