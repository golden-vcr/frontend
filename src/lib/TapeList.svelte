<script lang="ts">
  import TapeListItem from "./TapeListItem.svelte"
  import { type Tape } from "../tapes/index"
  export let tapes: Tape[]
</script>

<div>
{#each tapes as tape}
  <TapeListItem tape={tape} />
{/each}
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }
</style>
