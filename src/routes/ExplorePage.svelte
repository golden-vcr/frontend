<script lang="ts">  
  import TapeBrowser from '../lib/TapeBrowser.svelte'
  import { type Tape } from '../tapes/index'
  
  export let promise: Promise<Tape[]>
</script>

<div>
{#await promise}
  <p style="text-align: center">Loading...</p>
{:then tapes}
  <TapeBrowser tapes={tapes} condensed={true} byCategory={true} />
{:catch error}
  <p>{error.toString()}</p>
{/await}
</div>
