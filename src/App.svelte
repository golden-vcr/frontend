<script lang="ts">  
  import { Router, Link, Route } from 'svelte-routing'
  import HomePage from './routes/HomePage.svelte'
  import ExplorePage from './routes/ExplorePage.svelte'

  export let url = ''
</script>

<Router {url}>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/explore">Explore</Link>
  </nav>
  <div>
    <Route path="/" component={HomePage} />
    <Route path="/explore" component={ExplorePage} />
  </div>
</Router>
