<script lang="ts">
  import { Link } from 'svelte-routing'
  import { tapes } from '../../state/tapes'
  import LoadingPlaceholder from '../LoadingPlaceholder.svelte'
  import TapeThumbnail from './TapeThumbnail.svelte'
  import Tag from '../Tag.svelte'

  export let tapeId: number

  $: tape = $tapes.find((x) => x.id === tapeId) || null

  function formatRuntimeAndYear(runtime?: number, year?: number): string {
    let s = ''
    if (runtime) {
      s += `${runtime} min`
      if (year) {
        s += ', '
      }
    }
    if (year) {
      s += `${year}`
    }
    return s
  }
</script>

<div class="container">
{#if tape}
  <TapeThumbnail {tape} dogEarIfScreened />
{:else}
  <div class="thumbnail-placeholder" />
{/if}
  <div class="info">
    <div class="title">
{#if tape}
      <Link to={`/tapes/${tapeId}`}>{tape.title}</Link>
{:else}
      <LoadingPlaceholder length={40} plus={24} />
{/if}
    </div>
    <div class="tags">
{#if tape}
{#each tape.tags as tag}
      <Tag {tag} />
{/each}
{:else}
{#each Array(Math.trunc(Math.random() * 3) + 1) as i}
      <span class="tag-placeholder">
        <LoadingPlaceholder length={6} plus={4} />
      </span>
{/each}
{/if}
    </div>
    <ul class="details">
{#if tape}
      <li>#{tape.id} &nbsp;|&nbsp; {'\u2665'} {tape.numFavorites}</li>
{#if tape.runtime || tape.year}
      <li>{formatRuntimeAndYear(tape.runtime, tape.year)}</li>
{/if}
{#if tape.contributor}
      <li>{tape.contributor}</li>
{/if}
{#if tape.broadcastIds.length > 0}
      <li>
        Broadcasts:{' '}
{#each tape.broadcastIds as broadcastId, i}
        <Link to={`/broadcasts/${broadcastId}`}>{broadcastId}</Link>
{#if i < tape.broadcastIds.length - 1}
        {'| '}
{/if}
{/each}
      </li>
{/if}
{:else}
    <li><LoadingPlaceholder length={10} plus={3} /></li>
{#if Math.random() < 0.8}
    <li><LoadingPlaceholder length={4} plus={8} /></li>
{/if}
{#if Math.random() < 0.4}
    <li><LoadingPlaceholder length={12} plus={8} /></li>
{/if}
{#if Math.random() < 0.4}
    <li><LoadingPlaceholder length={10} plus={5} /></li>
{/if}
{/if}
  </ul>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    gap: 0.675rem;
  }
  .thumbnail-placeholder {
    flex: 0 0 198px;
    height: 360px;
    background-color: #404040;
    border-radius: 8px;
  }
  .info {
    flex: 1 0;
    display: flex;
    flex-direction: column;
  }
  .title {
    line-height: 1.3;
    font-size: 1.5rem;
    font-weight: 500;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    padding: 0.3rem;
    gap: 0.3rem;
  }
  .tag-placeholder {
    font-size: 1.325rem;
    background-color: #404040;
    border-radius: 4px;
  }
  .details {
    list-style-type: none;
    margin: 0;
    padding: 1rem;
    font-size: 1.125rem;
  }
  @media only screen and (max-width: 696px) {
    .container {
      gap: 0.3rem;
    }
    .thumbnail-placeholder {
      flex-basis: 110px;
      height: 200px;
    }
    .title {
      font-size: 1.1rem;
      font-weight: 600;
    }
    .tags {
      padding: 0.125rem;
      gap: 0.2rem;
    }
    .tag-placeholder {
      font-size: 1rem;
    }
    .details {
      padding: 0.5rem;
      font-size: 1rem;
    }
  }
</style>