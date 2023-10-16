<script lang="ts">
  import { config } from '../config';

  export let isEnabled: boolean
  export let isLoggedIn: boolean
  export let loginUrl: string

  $: buttonClass = isEnabled ? '' : 'disabled'
</script>

{#if isLoggedIn}
<a role="button" class={buttonClass} href={config.twitch.logoutPath}>Log out</a>
{:else}
<a role="button" class={buttonClass} href={loginUrl}>Log in with Twitch</a>
{/if}

<style>
  a {
    margin-left: 0.25rem;
    padding: 0.25rem 1rem;
    background-color: #6441a5;
    border: 1px solid #4d3183;
    border-radius: 4px;
    color: #fff;
    user-select: none;
    white-space: nowrap;
  }
  a:hover {
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
