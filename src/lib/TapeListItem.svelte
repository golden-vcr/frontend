<script lang="ts">
  import { type Tape } from "../tapes/index"
  export let tape: Tape
</script>

<li>{tape.id}: {tape.title}</li>
<img src={tape.thumbnailImage} alt={`Preview image for tape ${tape.id}`} />
