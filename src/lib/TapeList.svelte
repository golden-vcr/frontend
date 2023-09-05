<script lang="ts">
  import TapeListItem from "./TapeListItem.svelte"
  import { type Tape } from "../tapes/types"
  export let tapes: Tape[]
</script>

<ul>
{#each tapes as tape}
  <TapeListItem tape={tape} />
{/each}
</ul>
