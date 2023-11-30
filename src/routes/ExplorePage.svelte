<script lang="ts">  
  import TapeBrowser from '../lib/TapeBrowser.svelte'
  import { tapes } from '../state/tapes'

  let includeTapesWithBroadcastHistory = new URLSearchParams(window.location.search).get('show') === 'all'
</script>

<div>
  <TapeBrowser tapes={$tapes} condensed={true} byCategory={true} {includeTapesWithBroadcastHistory} /> 
</div>
