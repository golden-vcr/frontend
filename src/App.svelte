<script lang="ts">  
  import { Router, Link, Route } from 'svelte-routing'
  import HomePage from './routes/HomePage.svelte'
  import TapesPage from './routes/TapesPage.svelte'
  import ExplorePage from './routes/ExplorePage.svelte'

  export let url = ''
</script>

<Router {url}>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/tapes">Tapes</Link>
    <Link to="/explore">Explore</Link>
  </nav>
  <div>
    <Route path="/" component={HomePage} />
    <Route path="/tapes" component={TapesPage} />
    <Route path="/explore" component={ExplorePage} />
  </div>
</Router>
