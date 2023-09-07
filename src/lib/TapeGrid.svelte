<script lang="ts">
  import TapeGridItem from "./TapeGridItem.svelte"
  import { type Tape } from "../tapes/index"
  export let tapes: Tape[]
</script>

<div>
{#each tapes as tape}
  <TapeGridItem tape={tape} />
{/each}
</div>

<style>
  div {
    display: grid;
    grid-template-columns: repeat(auto-fit, 200px);
    gap: 0.5rem;
    place-content: center;
  }
</style>
