<script lang="ts">  
  import TapeBrowser from '../lib/TapeBrowser.svelte'
  import { tapes } from '../tapes'
</script>

<div>
{#if $tapes.isLoading}
  <p style="text-align: center">Loading...</p>
{:else if $tapes.error}
  <p>{$tapes.error.toString()}</p>
{:else}
  <TapeBrowser tapes={$tapes.tapes} condensed={true} byCategory={true} /> 
{/if}
</div>
