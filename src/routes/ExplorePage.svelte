<script lang="ts">  
  import TapeGrid from '../lib/TapeGrid.svelte';
  import { type Tape } from '../tapes/index'
  
  export let promise: Promise<Tape[]>
</script>

<main>
{#await promise}
  <p style="text-align: center">Loading...</p>
{:then tapes}
  <TapeGrid tapes={tapes} />
{:catch error}
  <p>{error.toString()}</p>
{/await}
</main>

<style>
  main {
    padding: 1rem;
  }
  @media only screen and (max-width: 696px) {
    main {
      padding: 0;
      padding-top: 1rem;
    }
  }
</style>
