<script lang="ts">
  import { navigate } from 'svelte-routing'
  import TapeDetails from '../lib/TapeDetails.svelte'
  import { tapes } from '../tapes'
  import { auth } from '../auth'

  export let tapeId: number
  $: tape = $tapes.tapes.find((x) => x.id === tapeId)
  $: showAdminControls = $auth.state.loggedIn && $auth.state.role === 'broadcaster'
</script>

{#if $tapes.isLoading}
<p style="text-align: center">Loading...</p>
{:else if $tapes.error}
<p>{$tapes.error.toString()}</p>
{:else if tape}
<TapeDetails tape={tape} {showAdminControls} />
{:else}
{navigate('/')}
{/if}
