<script lang="ts">
  import TapeThumbnail from './tapes/TapeThumbnail.svelte'

  import { type Tape } from '../state/tapes'
  export let tapes: Tape[]
</script>

<div class="container">
{#each tapes as tape}
  <TapeThumbnail {tape} dogEarIfScreened />
{/each}
</div>

<style>
  .container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    padding: 0.375rem;
  }
</style>
