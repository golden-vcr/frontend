<script lang="ts">
  import { Router, Link, Route } from 'svelte-routing'
  import TwitchLoginButton from './lib/TwitchLoginButton.svelte'

  import HomePage from './routes/HomePage.svelte'
  import TapesPage from './routes/TapesPage.svelte'
  import TapePage from './routes/TapePage.svelte'
  import ExplorePage from './routes/ExplorePage.svelte'
  import ProfilePage from './routes/ProfilePage.svelte';

  import { fetchTapes } from './tapes'
  import { auth } from './auth'

  export let url = ''
  let promise = fetchTapes()
</script>

<Router {url}>
  <nav>
    <div class="links">
      <Link to="/">Home</Link>
      <Link to="/tapes">Tapes</Link>
      <Link to="/explore">Explore</Link>
    </div>
    <div class="spacer" />
{#if !$auth.state.loggedIn && !!$auth.state.error}
    <div class="error">
      <b>LOGIN ERROR:</b> {$auth.state.error}
    </div>
{/if}
    <TwitchLoginButton
      loggedInUsername={$auth.state.loggedIn ? $auth.state.user.displayName : ''}
      loginUrl={$auth.isPending ? '' : $auth.loginUrl}
      enableButtons={!$auth.isPending}
    />
  </nav>
  <main>
    <Route path="/" component={HomePage} />
    <Route path="/tapes">
      <TapesPage promise={promise} />
    </Route>
    <Route path="/tapes/:tapeId" let:params>
      <TapePage promise={promise} tapeId={parseInt(params.tapeId)} />
    </Route>
    <Route path="/explore">
      <ExplorePage promise={promise} />
    </Route>
    <Route path="/profile" component={ProfilePage} />
  </main>
</Router>

<style>
  nav {
    display: flex;
    align-items: center;
  }
  .error {
    border: 2px solid #aa0000;
    background-color: #ffaaaa;
    color: #aa0000;
    padding: 0.2rem 1rem;
    margin-right: 1rem;
  }
  .links {
    padding: 1rem;
  }
  .spacer {
    flex: 1;
  }
</style>