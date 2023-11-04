<script lang="ts">
  import { auth } from '../auth'
  import { balance } from '../ledger'

  import TransactionLog from '../lib/TransactionLog.svelte'
</script>

<div>
  <p>Profile!</p>

{#if $auth.state.loggedIn}
  <p>Hello, {$auth.state.user.displayName}. Your Twitch User ID is <b>{$auth.state.user.id}</b>.</p>
  <p>Your role is <b>{$auth.state.role}</b>.</p>

{#if $balance.state === 'loading' && $balance.error}
  <p>ERROR: $balance.error</p>
{:else if $balance.state === 'loading'}
  <p>Loading balance...</p>
{:else if $balance.state === 'loaded'}
  <p>Your available balance is <b>{$balance.value.availablePoints} points</b>.</p>
{/if}

<TransactionLog />

{:else}
  <p>You are not logged in. Scram!</p>
{/if}

</div>
