<script lang="ts">
  import { Link } from 'svelte-routing'
  import { config } from '../config';

  export let loggedInUsername: string
  export let profileImageUrl: string
  export let loginUrl: string
  export let enableButtons: boolean

  $: buttonClass = enableButtons ? 'twitch-auth-button' : 'twitch-auth-button disabled'
</script>

{#if loggedInUsername}
<div class="profile-link">
  <Link to="/profile">
{#if profileImageUrl}
    <img alt={`Twitch profile image for ${loggedInUsername}`} src={profileImageUrl} />
{/if}
    <span class="username">
      {loggedInUsername}
    </span>
  </Link>
</div>
<a role="button" class={buttonClass} href={config.twitch.logoutPath}>Log out</a>
{:else}
<a role="button" class={buttonClass} href={loginUrl}>Log in with Twitch</a>
{/if}

<style>
  .profile-link {
    display: flex;
    align-items: center;
  }
  :global(.profile-link > a) {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }
  img {
    width: 30px;
    height: 30px;
    border-radius: 30px;
  }
  .twitch-auth-button {
    margin-right: 1rem;
    padding: 0.25rem 1rem;
    background-color: #6441a5;
    border: 1px solid #4d3183;
    border-radius: 4px;
    color: #fff;
    user-select: none;
    white-space: nowrap;
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
  @media only screen and (max-width: 696px) {
    .username {
      display: none;
    }
  }
</style>
