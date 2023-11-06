<script lang="ts">
  import { Link } from 'svelte-routing'

  import { auth } from '../auth'
  import { balance } from '../state/balance'

  import TransactionLog from '../lib/TransactionLog.svelte'
</script>

<div>
  <p>Profile!</p>

{#if $auth.state.loggedIn}
  <p>Hello, {$auth.state.user.displayName}. Your Twitch User ID is <b>{$auth.state.user.id}</b>.</p>
  <p>Your role is <b>{$auth.state.role}</b>.</p>
  <p>To view your favorite tapes, click <Link to="/favorites">here</Link>.</p>
{#if $balance.isLoading}
  <p>Loading balance...</p>
{:else}
  <p>Your available balance is <b>{$balance.numPointsAvailable} points</b>.</p>
{/if}

<TransactionLog />

{:else}
  <p>You are not logged in. Scram!</p>
{/if}

</div>
