<script lang="ts">
  import { onMount } from 'svelte'
  import { Link } from 'svelte-routing'

  import { createBroadcastStateSource, type BroadcastState } from '../apis/showtime/state'

  import { auth } from '../auth'
  import { tapes } from '../state/tapes'
  import { balance } from '../state/balance'

  import AboutContent from '../lib/AboutContent.svelte'
  import TapeListItem from '../lib/TapeListItem.svelte'
  import ImageAlertForm from '../lib/ImageAlertForm.svelte'

  let state = { isLive: false } as BroadcastState
  let source = null as EventSource | null
  let errorMessage = ''
  
  $: currentTape = (state.isLive && !!state.screeningTapeId) ? ($tapes.find((x) => state.isLive && x.id === state.screeningTapeId) || null) : null

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

{#if currentTape}
  <p>Join the fun now at <a href="https://www.twitch.tv/goldenvcr">twitch.tv/GoldenVCR</a>, where we're currently watching:</p>
  <TapeListItem tape={currentTape} withFrame />
{:else}
  <p>Live now at <a href="https://www.twitch.tv/goldenvcr">twitch.tv/GoldenVCR</a>!</p>
{/if}

<p>
  What are we watching next? You decide! Head on over to the
  <Link to="/explore">Explore</Link> page to browse the collection.
</p>

{#if $auth.state.loggedIn}
<p>
  Hello, <b>{$auth.state.user.displayName}</b>! You currently have a balance of
  <b>{$balance.numPointsAvailable}</b> Golden VCR Fun Points.
</p>
<ImageAlertForm />
{:else}
<p>
  If you'd like to send a ghostly apparition to haunt my VCR, then you can use the
  <b>Log in with Twitch</b> button above to start using Golden VCR Fun Points.
  Connecting your Twitch account to GoldenVCR.com just lets us verify your identity as a
  viewer; we don't require any access to your Twitch account beyond seeing which
  channels you follow and subscribe to.
</p>
{/if}

</div>
{:else}
<AboutContent />
{/if}
