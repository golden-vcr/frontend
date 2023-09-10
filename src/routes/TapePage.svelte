<script lang="ts">
  import { navigate } from 'svelte-routing'
  import TapeDetails from '../lib/TapeDetails.svelte'
  import { type Tape } from '../tapes/index'
  
  export let promise: Promise<Tape[]>
  export let tapeId: number
  const tapePromise = promise.then((tapes) => {
    const found = tapes.find((x) => x.id === tapeId)
    if (!found) {
      throw navigate('/')
    }
    return found
  })
</script>

<main>
{#await tapePromise}
  <p style="text-align: center">Loading...</p>
{:then tape}
  <TapeDetails tape={tape} />
{:catch error}
  <p>{error.toString()}</p>
{/await}
</main>

<style>
  main {
    padding: 2rem;
  }
  @media only screen and (max-width: 696px) {
    main {
      padding: 1rem;
    }
  }
</style>
