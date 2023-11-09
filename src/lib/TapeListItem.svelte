<script lang="ts">
  import { Link } from 'svelte-routing'
  import { type Tape } from '../state/tapes'

  import TapeThumbnail from './TapeThumbnail.svelte'
  import Tag from './Tag.svelte'

  export let tape: Tape

  export let withFrame = false
</script>

<div class={`container${withFrame ? ' frame' : ''}`} style={`border-color: ${tape.color}`}>
  <TapeThumbnail {tape} />
  <div class="info">
    <span class="title">
      <Link to={`/tapes/${tape.id}`}>{tape.title}</Link>
    </span>
    <div class="tags">
{#each tape.tags as tag}
      <Tag {tag} />
{/each}
    </div>
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
      <li>
{#if tape.broadcastIds.length > 0}
        <b>Last screened in:</b> <Link to={`/broadcasts/${tape.broadcastIds[tape.broadcastIds.length - 1]}`}>Broadcast {tape.broadcastIds[tape.broadcastIds.length - 1]}</Link>
{:else}
        <em>Never screened</em>
{/if}
      </li>
    </ul>
  </div>
</div>

<style>
  .container {
    display: flex;
    width: 100%;
  }
  .frame {
    border: 1px solid;
    border-left: 8px solid;
    padding: 1rem;
    background-color: #181818;
  }
  .info {
    width: 100%;
    padding: 0 1rem;
  }
  .title {
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 1.0;
  }
  :global(.title a) {
    color: white;
  }
  :global(.title a:hover) {
    color: #535bf2;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    padding: 0.375rem;
  }
  @media only screen and (max-width: 696px) {
    .title {
      font-size: 1.125rem;
    }
    ul {
      margin: 0;
      padding-left: 1rem;
      font-size: 0.75rem;
    }
  }
</style>
