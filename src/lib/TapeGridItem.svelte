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
  @media only screen and (max-width: 696px) {
    img {
      max-width: 160px;
    }
  }
  @media only screen and (min-width: 1600px) {
    img {
      max-width: 275px;
    }
  }
  p {
    margin-top: 0;
  }
</style>
