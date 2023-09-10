<script lang="ts">  
  import { Router, Link, Route } from 'svelte-routing'
  import HomePage from './routes/HomePage.svelte'
  import TapesPage from './routes/TapesPage.svelte'
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
    <Route path="/explore">
      <ExplorePage promise={promise} />
    </Route>
  </div>
</Router>
