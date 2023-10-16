<script lang="ts">
  import NavLink from './NavLink.svelte'
  import NavProfile from './NavProfile.svelte'
  import NavTwitchButton from './NavTwitchButton.svelte'

  import { auth } from '../auth'

  export let showAdminLinks: boolean
</script>

<header>
  <nav>
    <div class="pages">
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
    padding: 0.5rem 1rem;
    padding-left: 0.5rem;
  }
  :global(nav a) {
    color: white;
  }
  :global(nav a):hover {
    color: #dedede;
  }
  :global(.pages a) {
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
  }
  :global(.pages a):hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  .spacer {
    flex: 1;
  }
</style>
