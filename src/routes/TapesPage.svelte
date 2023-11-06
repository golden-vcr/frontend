<script lang="ts">  
  import TapeBrowser from '../lib/TapeBrowser.svelte'
  import { tapes } from '../state/tapes'
</script>

<div>
  <TapeBrowser tapes={$tapes} condensed={false} byCategory={false} />
</div>
