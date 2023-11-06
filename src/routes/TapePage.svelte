<script lang="ts">
  import TapeDetails from '../lib/TapeDetails.svelte'

  import { auth } from '../auth'
  import { tapes } from '../state/tapes'

  export let tapeId: number
  $: tape = $tapes.find((x) => x.id === tapeId)
  $: showAdminControls = $auth.state.loggedIn && $auth.state.role === 'broadcaster'
</script>

{#if tape}
<TapeDetails {tape} {showAdminControls} />
{:else}
<p style="text-align: center">Loading...</p>
{/if}
