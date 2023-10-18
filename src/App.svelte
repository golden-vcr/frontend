<script lang="ts">
  import { onMount } from 'svelte'
  import { Router, Route } from 'svelte-routing'
  import NavHeader from './lib/NavHeader.svelte'

  import HomePage from './routes/HomePage.svelte'
  import TapesPage from './routes/TapesPage.svelte'
  import TapePage from './routes/TapePage.svelte'
  import ExplorePage from './routes/ExplorePage.svelte'
  import BroadcastPage from './routes/BroadcastPage.svelte'
  import AdminPage from './routes/AdminPage.svelte'
  import ProfilePage from './routes/ProfilePage.svelte'

  import { initTapes } from './tapes'
  import { auth } from './auth'

  onMount(() => {
    initTapes()
  })

  $: showAdminLinks = $auth.state.loggedIn && $auth.state.role === 'broadcaster'

  export let url = ''
</script>

<Router {url}>
  <NavHeader {showAdminLinks} />
  <main>
{#if !$auth.state.loggedIn && !!$auth.state.error}
    <div class="error">
      <b>LOGIN ERROR:</b> {$auth.state.error}
    </div>
{/if}
    <Route path="/" component={HomePage} />
    <Route path="/tapes">
      <TapesPage />
    </Route>
    <Route path="/tapes/:tapeId" let:params>
      <TapePage tapeId={parseInt(params.tapeId)} {showAdminLinks} />
    </Route>
    <Route path="/explore">
      <ExplorePage />
    </Route>
    <Route path="/broadcasts/:broadcastId" let:params>
      <BroadcastPage broadcastId={parseInt(params.broadcastId)} />
    </Route>
    <Route path="/admin">
      <AdminPage />
    </Route>
    <Route path="/profile" component={ProfilePage} />
  </main>
</Router>

<style>
  .error {
    border: 2px solid #aa0000;
    background-color: #ffaaaa;
    color: #aa0000;
    margin: 1rem;
    margin-bottom: 0;
    padding: 0.2rem 1rem;
    margin-right: 1rem;
  }
</style>
