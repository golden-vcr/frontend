<script lang="ts">
  import { writable } from 'svelte/store'

  import { authorizedFetch } from '../auth'
    import { onMount } from 'svelte';

  const lines = writable([] as string[])

  let nextRequestId = 0

  function clearTape() {
    const requestId = nextRequestId++
    lines.update((prev) => prev.concat([`[${requestId}] Clearing the current tape...`]))
    authorizedFetch('/api/showtime/admin/tape', { method: 'DELETE' })
      .then((r) => {
        lines.update((prev) => prev.concat([`[${requestId}] Got response ${r.status}`]))
      })
      .catch((err) => {
        lines.update((prev) => prev.concat([`[${requestId}] ERROR: ${err}`]))
      })
  }

  function setTape() {
    const tapeId = String(Math.round(Math.random() * 80))
    const requestId = nextRequestId++
    lines.update((prev) => prev.concat([`[${requestId}] Setting the current tape to ${tapeId}...`]))
    authorizedFetch(`/api/showtime/admin/tape/${tapeId}`, { method: 'POST' })
      .then((r) => {
        lines.update((prev) => prev.concat([`[${requestId}] Got response ${r.status}`]))
      })
      .catch((err) => {
        lines.update((prev) => prev.concat([`[${requestId}] ERROR: ${err}`]))
      })
  }

  onMount(() => {
    clearTape()
  })
</script>

<div class="container">
  <button on:click={() => clearTape()}>Clear tape</button>
  <button on:click={() => setTape()}>Activate random tape</button>
  <ul>
{#each $lines as line}
    <li>{line}</li>
{/each}
  </ul>
</div>

<style>
  .container {
    padding: 2em;
  }
</style>
