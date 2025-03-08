<script lang="ts">
  import { type Tape } from '../../state/tapes'

  export let tape: Tape
  export let isTagged: boolean
</script>

<div class="container">
  <div class="image">
{#if tape.images.length > 0}
    <img alt={tape.title} src={tape.images[0].url} />
{/if}
  </div>
  <div class="right">
    <h1>{tape.title}</h1>
    <ul>
      <li><b>ID:</b> {tape.id}</li>
      <li><b>Year:</b> {tape.year || 'n/a'}</li>
      <li><b>Runtime:</b> {tape.runtime ? `${tape.runtime} min` : 'n/a'}</li>
      <li><b>Contributor:</b> {tape.contributor || 'self'}</li>
      <li><b>Broadcasts:</b> {tape.broadcastIds.length > 0 ? tape.broadcastIds.join(', ') : 'Not screened.'} </li>
      <li><b>Series:</b> {tape.series || 'n/a'}</li>
    </ul>
    <div class="tag">
      {isTagged ? '\u2705' : '\u274c'}
    </div>
  </div>
</div>

<style>
  .container {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 2.5fr;
    gap: 2em;
  }
  .image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .right {
    padding: 5em 0;
  }
  h1 {
    font-size: 2em;
  }
  li {
    font-size: 1.5em;
  }
  .tag {
    border: 4px solid #999;
    padding: 3rem;
    font-size: 5em;
  }
</style>
