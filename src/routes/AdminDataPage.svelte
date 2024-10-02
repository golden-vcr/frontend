<script lang="ts">
  import { onMount } from "svelte";
  import TapeDataView from "../lib/tapes/TapeDataView.svelte";

  onMount(() => {
    const header = document.getElementById('nav-header')
    if (header) {
      header.style.display = 'none'
    }
    return () => {
      if (header) {
        header.style.display = 'flex'
      }
    }
  })
</script>

<div class="container">
  <TapeDataView />
</div>

<style>
  .container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 2rem;
  }
</style>
