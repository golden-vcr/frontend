<script lang="ts">
  import { Link } from 'svelte-routing'
  import TwitchLoginButton from './TwitchLoginButton.svelte'

  import { auth } from '../auth'

  $: showAdminLinks = $auth.state.loggedIn && $auth.state.role === 'broadcaster'
</script>

<header>
  <nav>
    <div class="links">
      <Link to="/">Home</Link>
      <Link to="/tapes">Tapes</Link>
      <Link to="/explore">Explore</Link>
{#if showAdminLinks}
      <Link to="/admin">Admin</Link>
{/if}
    </div>
    <div class="spacer" />
    <TwitchLoginButton
      loggedInUsername={$auth.state.loggedIn ? $auth.state.user.displayName : ''}
      profileImageUrl={$auth.state.loggedIn ? $auth.state.profileImageUrl : ''}
      loginUrl={$auth.isPending ? '' : $auth.loginUrl}
      enableButtons={!$auth.isPending}
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
