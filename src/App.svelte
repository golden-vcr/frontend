<script lang="ts">  
  import TapeList from './lib/TapeList.svelte';
  import { fetchTapes } from './tapes/api'

  let promise = fetchTapes()
</script>

<main>
  <h2>Golden VCR Video Library</h2>
{#await promise}
  <p>Loading...</p>
{:then tapeListing}
  <TapeList tapes={tapeListing.tapes} />
{:catch error}
  <p>{error.toString()}</p>
{/await}
</main>
