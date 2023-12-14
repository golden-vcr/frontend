<script lang="ts">
  import { Link } from 'svelte-routing'

  const numBroadcastsToShow = 10
  const broadcastIds = [...Array(numBroadcastsToShow).keys()].map((x) => x + 1)
</script>

<p>Follow at: <a href="https://www.twitch.tv/goldenvcr">twitch.tv/GoldenVCR</a></p>
<p>See the details of past broadcasts:</p>
<ul>
{#each broadcastIds as broadcastId}
  <li>
    <Link to={`/broadcasts/${broadcastId}`}>Broadcast {broadcastId}</Link>
  </li>
{/each}
</ul>

<p>
  For information about contributing tapes to the Golden VCR Library, click
  <Link to="/contributions">here</Link>.
</p>

<style>
  p, ul {
    margin-top: 0;
  }
</style>
