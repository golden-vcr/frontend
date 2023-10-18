<script lang="ts">
  import { navigate } from 'svelte-routing'
  import TapeDetails from '../lib/TapeDetails.svelte'
  import { tapes } from '../tapes'

  export let tapeId: number
  export let showAdminLinks: boolean
  $: tape = $tapes.tapes.find((x) => x.id === tapeId)
</script>

{#if $tapes.isLoading}
<p style="text-align: center">Loading...</p>
{:else if $tapes.error}
<p>{$tapes.error.toString()}</p>
{:else if tape}
<TapeDetails tape={tape} {showAdminLinks} />
{:else}
{navigate('/')}
{/if}
