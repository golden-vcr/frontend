<script lang="ts">  
  import TapeList from './lib/TapeList.svelte';
  import { fetchTapes } from './tapes/index'

  let promise = fetchTapes()
</script>

<main>
  <h2>Golden VCR Video Library</h2>
{#await promise}
  <p>Loading...</p>
{:then tapes}
  <TapeList tapes={tapes} />
{:catch error}
  <p>{error.toString()}</p>
{/await}
</main>
