<script lang="ts">  
  import { type Tape } from '../tapes/index'
  export let tape: Tape
</script>

<div>
  <pre>{JSON.stringify(tape, null, 4)}</pre>
</div>

<style>
  div {
    background-color: #181818;
    border: 1px solid #232323;
  }
  pre {
    margin: 0;
    padding: 1em;
  }
</style>
