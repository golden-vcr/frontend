<script lang="ts">  
  import { Router, Link, Route } from 'svelte-routing'
  import HomePage from './routes/HomePage.svelte'
  import TapesPage from './routes/TapesPage.svelte'
  import TapePage from './routes/TapePage.svelte'
  import ExplorePage from './routes/ExplorePage.svelte'
  import { fetchTapes } from './tapes'

  export let url = ''
  let promise = fetchTapes()
</script>

<Router {url}>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/tapes">Tapes</Link>
    <Link to="/explore">Explore</Link>
  </nav>
  <div>
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
  </div>
</Router>
