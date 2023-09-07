<script lang="ts">
  import TapeListItem from "./TapeListItem.svelte"
  import { type Tape } from "../tapes/index"
  export let tapes: Tape[]
</script>

<ul>
{#each tapes as tape}
  <TapeListItem tape={tape} />
{/each}
</ul>
