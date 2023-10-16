<script lang="ts">
  import NavLink from './NavLink.svelte'
  import NavProfile from './NavProfile.svelte'
  import NavTwitchButton from './NavTwitchButton.svelte'

  import { auth } from '../auth'

  export let showAdminLinks: boolean
  export let onClick: () => void
  export let isVertical: boolean = false
</script>

<div class="pages">
  <NavLink {onClick} to="/">Home</NavLink>
  <NavLink {onClick} to="/tapes">Tapes</NavLink>
  <NavLink {onClick} to="/explore">Explore</NavLink>
{#if showAdminLinks}
  <NavLink {onClick} to="/admin">Admin</NavLink>
{/if}
</div>
{#if isVertical}
<div class="separator" />
{:else}
<div class="spacer" />
{/if}
{#if $auth.state.loggedIn}
<NavLink {onClick} to="/profile">
  <NavProfile
    twitchDisplayName={$auth.state.user.displayName}
    twitchProfileImageUrl={$auth.state.profileImageUrl}
  />
</NavLink>
{/if}
<NavTwitchButton
  isEnabled={!$auth.isPending}
  isLoggedIn={$auth.state.loggedIn}
  loginUrl={$auth.isPending ? '' : $auth.loginUrl}
/>

<style>
  .spacer {
    flex: 1;
  }
  .separator {
    margin: 0 0.5rem;
  }
</style>
