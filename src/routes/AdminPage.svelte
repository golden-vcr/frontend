<script lang="ts">
  import { writable } from 'svelte/store'

  import { authorizedFetch } from '../auth'

  const lines = writable([] as string[])

  let nextRequestId = 0

  async function handleResponse(requestId: number, r: Response) {
    if (r.ok) {
      lines.update((prev) => prev.concat([`[${requestId}] OK; got response ${r.status}`]))
    } else {
      let message = ''
      try {
        message = await r.text()
      } catch (ignored) {
      }
      const suffix = message.length > 0 ? `: ${message}` : ''
      lines.update((prev) => prev.concat([`[${requestId}] Failed; got response ${r.status}${suffix}`]))
    }
  }

  function clearTape() {
    const requestId = nextRequestId++
    lines.update((prev) => prev.concat([`[${requestId}] Clearing the current tape...`]))
    authorizedFetch('/api/showtime/admin/tape', { method: 'DELETE' })
      .then((r) => {
        handleResponse(requestId, r)
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
        handleResponse(requestId, r)
      })
      .catch((err) => {
        lines.update((prev) => prev.concat([`[${requestId}] ERROR: ${err}`]))
      })
  }

  function grantCredit(twitchDisplayName: string, numPointsToCredit: number, note: string) {
    const requestId = nextRequestId++
    lines.update((prev) => prev.concat([`[${requestId}] Crediting ${numPointsToCredit} points to ${twitchDisplayName}...`]))
    authorizedFetch('/api/ledger/inflow/manual-credit', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        twitchDisplayName,
        numPointsToCredit,
        note,
      }),
    })
      .then((r) => {
        handleResponse(requestId, r)
      })
      .catch((err) => {
        lines.update((prev) => prev.concat([`[${requestId}] ERROR: ${err}`]))
      })
  }

  let usernameToCredit = ''
  let numPoints = 0
  let note = ''
  $: canGrantCredit = usernameToCredit.length > 0 && numPoints > 0 && note.length > 0

</script>

<div class="container">
  <div class="tape-buttons">
    <button on:click={() => clearTape()}>Clear tape</button>
    <button on:click={() => setTape()}>Activate random tape</button>
  </div>
  <div class="credit-grant-form">
    <input type="text" bind:value={usernameToCredit} />
    <input type="number" bind:value={numPoints} />
    <input type="text" bind:value={note} />
    <button
      disabled={!canGrantCredit}
      on:click={() => {
        grantCredit(usernameToCredit, numPoints, note)
        usernameToCredit = ''
      }}
    >
      Grant Credit
    </button>
  </div>
  <ul>
{#each $lines as line}
    <li>{line}</li>
{/each}
  </ul>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .tape-buttons {
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
  }
  .credit-grant-form {
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
  }
</style>