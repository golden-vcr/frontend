<script lang="ts">
  import { onMount } from 'svelte'
  import { type SubscriptionStatus, fetchSubscriptionStatus, createMissingSubscriptions, deleteAllSubscriptions } from '../apis/hooks/subscription'
  import { signalError } from '../state/errors'

  let isLoading = true
  let isModifying = false
  let status = { ok: false, subscriptions: [] } as SubscriptionStatus

  function reloadStatus() {
    isLoading = true
    fetchSubscriptionStatus().then((newStatus) => {
      isLoading = false
      status = newStatus
    }).catch((err) => {
      const message = (err instanceof Error) ? err.message : String(err)
      signalError(`Failed to fetch subscription status: ${message}`)
    })
  }

  onMount(reloadStatus)

  const onClickDelete = () => {
    isModifying = true
    deleteAllSubscriptions().then(() => {
      isModifying = false
      reloadStatus()
    }).catch((err) => {
      const message = (err instanceof Error) ? err.message : String(err)
      signalError(`Failed to delete subscriptions: ${message}`)
    })
  }

  const onClickCreate = () => {
    isModifying = true
    createMissingSubscriptions().then(() => {
      isModifying = false
      reloadStatus()
    }).catch((err) => {
      const message = (err instanceof Error) ? err.message : String(err)
      signalError(`Failed to create subscriptions: ${message}`)
    })
  }

  $: canDelete = !isLoading && !isModifying && status.subscriptions.length > 1
  $: canCreate = !isLoading && !isModifying && !!status.subscriptions.find((x) => x.status === 'missing') && !status.ok
</script>

<h2>Hooks</h2>
<div class="controls">
  <div class="status-readout">
{#if isLoading}
    <div class="status-emoji">{'\u{1f914}'}</div> Loading...
{:else if isModifying}
    <div class="status-emoji">{'\u{1f6e0}'}</div> Modifying subscriptions...
{:else if status.ok}
    <div class="status-emoji">{'\u2705'}</div> All required EventSub callbacks are enabled.
{:else}
    <div class="status-emoji">{'\u274c'}</div> EventSub callbacks need to be registered.
{/if}
  </div>
  <div class="expand" />
  <button
    on:click={onClickDelete}
    disabled={!canDelete}
  >
    Delete All
  </button>
  <button
    on:click={onClickCreate}
    disabled={!canCreate}
  >
    Create Missing
  </button>
</div>

{#if status.subscriptions.length > 0}
<table>
  <tr>
    <th style="width: 20%">Type</th>
    <th style="width: 5%">Version</th>
    <th style="width: 20%">Status</th>
    <th style="width: 55%">Condition</th>
  </tr>
{#each status.subscriptions as subscription}
  <tr>
    <td>{subscription.type}</td>
    <td>{subscription.version}</td>
    <td>{subscription.status}</td>
    <td>{JSON.stringify(subscription.condition)}</td>
  </tr>
{/each}
</table>
{/if}

<p>
  To authorize the Golden VCR application to access your Twitch account with the
  required OAuth scopes for EventSub functionality, click
  <a href="/api/hooks/userauth/start" target="_blank">here</a>.
</p>

<style>
  h2 {
    margin-bottom: 0;
  }
  th, td {
    text-align: left;
  }
  td {
    font-family: 'Consolas', monospace;
  }
  .controls {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.325rem;
    padding: 0.675rem;
  }
  .status-readout {
    display: flex;
    align-items: center;
    gap: 0.675rem;
    font-size: 1.125rem;
    font-weight: 500;
    font-style: italic;
  }
  .status-emoji {
    font-size: 2rem;
  }
  .expand {
    flex: 1;
  }
</style>
