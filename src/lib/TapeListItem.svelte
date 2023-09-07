<script lang="ts">
  import { type Tape } from "../tapes/index"
  export let tape: Tape
</script>

<li>{tape.id}: <a href={tape.thumbnailImage}>{tape.title}</a></li>
