<script lang="ts">
  import TapeListItem from "./TapeListItem.svelte"
  import { type TapeListingItem } from "../tapes/types"
  export let tapes: TapeListingItem[]
</script>

<ul>
{#each tapes as tape}
  <TapeListItem tape={tape} />
{/each}
</ul>
