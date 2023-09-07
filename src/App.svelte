<script lang="ts">  
  import TapeGrid from './lib/TapeGrid.svelte';
  import { fetchTapes } from './tapes/index'

  let promise = fetchTapes()
</script>

<main>
  <h2>Golden VCR Video Library</h2>
{#await promise}
  <p>Loading...</p>
{:then tapes}
  <TapeGrid tapes={tapes} />
{:catch error}
  <p>{error.toString()}</p>
{/await}
</main>

<style>
  h2 {
    margin-top: 0;
  }
</style>