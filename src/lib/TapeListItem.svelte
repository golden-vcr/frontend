<script lang="ts">
  import { Link } from 'svelte-routing'
  import { type Tape } from '../tapes/index'
  export let tape: Tape
</script>

<div class="container">
  <img src={tape.thumbnailImage} alt={`Preview image for tape ${tape.id}`} loading="lazy" />
  <div class="info">
    <span class="title"><Link to={`/tapes/${tape.id}`}>{tape.title}</Link></span>
    <ul>
      <li>
        <b>Golden VCR ID:</b> #{String(tape.id).padStart(3, '0')}
      </li>
      <li>
{#if tape.year}
        <b>Year:</b> {tape.year}
{:else}
        <i>Unknown year</i>
{/if}
      </li>
      <li>
{#if tape.runtime}
        <b>Runtime:</b> {tape.runtime} minutes
{:else}
        <i>Unknown runtime</i>
{/if}
      </li>
    </ul>
  </div>
</div>

<style>
  .container {
    display: flex;
    width: 100%;
    margin-bottom: 20px;
  }
  img {
    height: 260px;
  }
  .info {
    width: 100%;
    padding: 1rem;
  }
  .title {
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 1.0;
  }
</style>

