<script lang="ts">  
  import TapeList from '../lib/TapeList.svelte';
  import { type Tape } from '../tapes/index'
  
  export let promise: Promise<Tape[]>
</script>

<main>
{#await promise}
  <p style="text-align: center">Loading...</p>
{:then tapes}
  <TapeList tapes={tapes} />
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
  