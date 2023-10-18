<script lang="ts">
  import { navigate } from 'svelte-routing'
  import TapeDetails from '../lib/TapeDetails.svelte'
  import { type Tape } from '../tapes/index'
  
  export let promise: Promise<Tape[]>
  export let tapeId: number
  export let showAdminLinks: boolean
  const tapePromise = promise.then((tapes) => {
    const found = tapes.find((x) => x.id === tapeId)
    if (!found) {
      throw navigate('/')
    }
    return found
  })
</script>

{#await tapePromise}
<p style="text-align: center">Loading...</p>
{:then tape}
<TapeDetails tape={tape} {showAdminLinks} />
{:catch error}
<p>{error.toString()}</p>
{/await}
