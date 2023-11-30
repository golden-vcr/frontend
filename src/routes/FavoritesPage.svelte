<script lang="ts">  
  import TapeBrowser from '../lib/TapeBrowser.svelte'
  import { tapes } from '../state/tapes'

  $: favoriteTapes = $tapes.filter((x) => x.isFavorite)
</script>

<div>
{#if favoriteTapes.length > 0}
  <TapeBrowser tapes={favoriteTapes} condensed={false} byCategory={false} includeTapesWithBroadcastHistory={true} />
{:else}
  <p>You have no favorite tapes selected.</p>
{/if}
</div>
