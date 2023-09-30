<script lang="ts">
  import { Link } from 'svelte-routing'
  import { config } from '../config';

  export let loggedInUsername: string
  export let loginUrl: string
  export let enableButtons: boolean

  $: buttonClass = enableButtons ? 'twitch-auth-button' : 'twitch-auth-button disabled'
</script>

{#if loggedInUsername}
<div>
  <Link to="/profile">{loggedInUsername}</Link>
  <a role="button" class={buttonClass} href={config.twitch.logoutPath}>Log out</a>
</div>
{:else}
<a role="button" class={buttonClass} href={loginUrl}>Log in with Twitch</a>
{/if}

<style>
  .twitch-auth-button {
    margin-right: 1rem;
    padding: 0.25rem 1rem;
    background-color: #6441a5;
    border: 1px solid #4d3183;
    border-radius: 4px;
    color: #fff;
    user-select: none;
  }
  .twitch-auth-button:hover {
    background-color: #4d3183;
    border-color: #6441a5;
  }
  .disabled, .disabled:hover {
    cursor: default;
    background-color: #6e6383;
    border-color: #7960a7;
    color: #a79fb6;
  }
</style>
