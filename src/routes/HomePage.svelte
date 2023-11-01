<script lang="ts">
  import { onMount } from 'svelte'
  import { createBroadcastStateSource, type BroadcastState } from '../broadcast'
  import AboutContent from '../lib/AboutContent.svelte'

  let state = { isLive: false } as BroadcastState
  let source = null as EventSource | null
  let errorMessage = ''

  onMount(() => {
    source = createBroadcastStateSource({
      onStateChange(newState) {
          state = newState
          if (!newState.isLive && source) {
            source.close()
            source = null
          }
      },
      onError(err) {
        errorMessage = err.message
      },
    })

    return () => {
      if (source) {
        source.close()
      }
    }
  })
</script>

{#if state.isLive}
  <div>
    <p>Live now at <a href="https://www.twitch.tv/goldenvcr">twitch.tv/GoldenVCR</a>!</p>
  </div>
{:else}
  <AboutContent />
{/if}

<style>
  div {
    padding: 2rem;
  }
</style>
