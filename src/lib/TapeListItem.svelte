<script lang="ts">
  import { type TapeListingItem } from "../tapes/types"
  export let tape: TapeListingItem
</script>

<li>{tape.id}: {tape.title}</li>
