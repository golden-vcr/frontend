<script lang="ts">
  import NavLink from './NavLink.svelte'
  import NavProfile from './NavProfile.svelte'
  import NavTwitchButton from './NavTwitchButton.svelte'

  import { auth } from '../auth'

  export let showAdminLinks: boolean
</script>

<header>
  <nav>
    <div class="links">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/tapes">Tapes</NavLink>
      <NavLink to="/explore">Explore</NavLink>
{#if showAdminLinks}
      <NavLink to="/admin">Admin</NavLink>
{/if}
    </div>
    <div class="spacer" />
{#if $auth.state.loggedIn}
    <NavLink to="/profile">
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
  </nav>
</header>

<style>
  header, nav {
    display: flex;
    align-items: center;
  }
  nav {
    flex: 1;
  }
  .links {
    padding: 1rem;
  }
  .spacer {
    flex: 1;
  }
</style>
