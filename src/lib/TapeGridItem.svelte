<script lang="ts">
  import { type Tape } from "../tapes/index"
  export let tape: Tape
</script>

<div>
  <img src={tape.thumbnailImage} alt={`Preview image for tape ${tape.id}`} />
  <p>{tape.title}</p>
</div>

<style>
  img {
    max-width: 200px;
  }
  p {
    margin-top: 0;
  }
</style>
