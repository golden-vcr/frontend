<script lang="ts">
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'

  import { fetchClipListing, type Clip } from '../apis/remix/state'
  import { signalError } from '../state/errors'

  const clips = writable([] as Clip[])
  const isLoading = writable(true)

  onMount(() => {
    fetchClipListing().then((value) => {
      clips.set(value.clips)
      isLoading.set(false)
    }).catch((err) => {
      const message = (err instanceof Error) ? err.message : String(err)
      signalError(`Failed to fetch clips: ${message}`)
    })
  })
</script>

{#if $isLoading}
<p>Loading...</p>
{:else}
<ul>
{#each $clips as clip}
  <li id={clip.id}>{clip.title}</li>
{/each}
</ul>
{/if}
