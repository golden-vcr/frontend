<script lang="ts">
  import { auth } from '../auth'
</script>

<div>
  <p>Profile!</p>
{#if $auth.state.loggedIn}
  <p>Hello, {$auth.state.user.displayName}. Your Twitch User ID is {$auth.state.user.id}.</p>
  <p>Your role is <b>{$auth.state.role}</b>.</p>
{:else}
  <p>You are not logged in. Scram!</p>
{/if}
</div>

<style>
  div {
    padding: 2rem;
  }
  p {
    margin-top: 0;
  }
</style>
