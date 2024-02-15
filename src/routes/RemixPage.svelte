<script lang="ts">
  import { onMount } from 'svelte'
  import { writable, derived } from 'svelte/store'
  import { Link } from 'svelte-routing'

  import { fetchClipListing, type Clip } from '../apis/remix/state'
  import { tapes } from '../state/tapes'
  import { signalError } from '../state/errors'

  const clips = writable([] as Clip[])
  const isLoading = writable(true)

  const items = derived([clips, tapes], ([$clips, $tapes]) => {
    return $clips.map((clip) => (
      {
        ...clip,
        tape: $tapes.find((x) => x.id == clip.tapeId),
      }
    ))
  })

  onMount(() => {
    fetchClipListing().then((value) => {
      clips.set(value.clips)
      isLoading.set(false)
    }).catch((err) => {
      const message = (err instanceof Error) ? err.message : String(err)
      signalError(`Failed to fetch clips: ${message}`)
    })
  })

  function formatDuration(totalSeconds: number) {
    const minutes = parseInt(String(totalSeconds / 60))
    const seconds = totalSeconds - (minutes * 60)
    return `${minutes}:${String(seconds).padStart(2, '0')}`
  }
</script>

<h2>Remix Clips</h2>
{#if $isLoading}
<p>Loading...</p>
{:else}
<div class="clip-list">
{#each $items as item}
  <div class="clip">
    <div class="thumbnail">
{#if item.tape}
      <img src={item.tape.thumbnailImage} alt={`Thumbnail image for tape ${item.tapeId}`} />
{:else}
      <div class="thumbnail-placeholder" />
{/if}
    </div>
    <div class="details">
      <div class="title">
        <span class="title-text">
          <Link to={`/tapes/${item.tapeId}`}>{item.title}</Link>
        </span>
        ({formatDuration(item.duration)})
      </div>
    </div>
  </div>
{/each}
</div>
{/if}

<style>
  .clip-list {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }
  .clip {
    display: flex;
  }
  .thumbnail {
    display: flex;
  }
  .thumbnail img, .thumbnail-placeholder {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
    margin: 0;
  }
  .thumbnail-placeholder {
    background-color: #404040;
  }
  .details {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .title {
    line-height: 1;
    padding: 0 0.4rem;
    margin-bottom: 0.2rem;
  }
  .title-text {
    font-size: 1.1875rem;
    font-weight: bold;
  }
</style>