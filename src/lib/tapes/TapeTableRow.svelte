<script lang="ts">
  import { Link } from 'svelte-routing'
  import { tapes } from '../../state/tapes'
  import LoadingPlaceholder from '../LoadingPlaceholder.svelte'
  import Tag from '../Tag.svelte'

  export let tapeId: number
  export let isHighlighted: boolean

  $: tape = $tapes.find((x) => x.id === tapeId) || null
</script>

<tr id={`tape-${tapeId}`} class={isHighlighted ? 'highlighted' : ''}>
  <th class="id">{tapeId}</th>
  <th class="favorites">
    <button
      class="favorites-button"
      disabled={!tape || !tape.onToggleFavorite}
      on:click={(e) => {
        if (tape && tape.onToggleFavorite) {
          e.stopPropagation()
          tape.onToggleFavorite()
        }
      }}
    >
      {tape && tape.isFavorite ? '\u2665' : '\u2661'}
    </button>
    <span>
{#if tape}
      {tape.numFavorites}
{:else}
      <LoadingPlaceholder length={2} plus={2} />
{/if}
    </span>
  </th>
  <td class="thumbnail">
{#if tape}
    <Link to={`/tapes/${tapeId}`}>
      <img
        src={tape.thumbnailImage}
        loading="lazy"
        alt={`Thumbnail image for tape ${tapeId}`} 
      />
    </Link>
{:else}
    <div class="thumbnail-placeholder" />
{/if}
  </td>
  <td class="title">
    <div class="details">
      <span class="title-text">
{#if tape}
        <Link to={`/tapes/${tapeId}`}>{tape.title}</Link>
{:else}
        <LoadingPlaceholder length={40} plus={24} />
{/if}
      </span>
      <div class="tags">
{#if tape}
{#each tape.tags as tag}
        <Tag {tag} small />
{/each}
{:else}
{#each Array(Math.trunc(Math.random() * 3) + 1) as i}
        <span class="tag-placeholder">
          <LoadingPlaceholder length={6} plus={4} />
        </span>
{/each}
{/if}
      </div>
    </div>
  </td>
  <td class="year">
{#if tape}
{#if tape.year}
    {tape.year}
{/if}
{:else if Math.random() < 0.9}
  <LoadingPlaceholder length={5} />
{/if}
  </td>
  <td class="runtime">
{#if tape}
{#if tape.runtime}
    {`${tape.runtime}m`}
{/if}
{:else if Math.random() < 0.8}
    <LoadingPlaceholder length={3} plus={1} />
{/if}
  </td>
  <td class="broadcasts">
{#if tape}
{#each tape.broadcastIds as broadcastId, i}
    <Link to={`/broadcasts/${broadcastId}`}>{broadcastId}</Link>{' '}
{/each}
{/if}
  </td>
  <td class="contributor">
{#if tape}
{#if tape.contributor}
    {tape.contributor}
{/if}
{:else if Math.random() < 0.4}
    <LoadingPlaceholder length={10} plus={6} />
{/if}
  </td>
</tr>

<style>
  tr {
    border-top: 1px solid #404040;
  }
  tr:hover {
    background-color: #5a5a5a33;
  }
  .highlighted {
    background-color: #ebe70041;
  }
  tr.highlighted:hover {
    background-color: #ebe70050;
  }
  th, td {
    padding: 0;
  }
  img {
    display: block;
  }
  .id {
    text-align: right;
    padding-right: 0.325rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #999;
  }
  .favorites {
    padding: 0 0.2rem;
  }
  .favorites-button {
    line-height: 1;
    padding: 0.5rem ;
  }
  .thumbnail img, .thumbnail-placeholder {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
    margin: 4px 0;
  }
  .thumbnail-placeholder {
    background-color: #404040;
  }
  .title {
    font-size: 1.1875rem;
    font-weight: bold;
    line-height: 1;
    padding: 0 0.4rem;
  }
  .title-text {
    margin-bottom: 0.2rem;
  }
  .details {
    display: flex;
    flex-direction: column;
  }
  .tags {
    display: flex;
    flex-direction: row;
    gap: 0.2rem;
    padding: 0.2rem 0.4rem;
  }
  .tag-placeholder {
    font-size: 1.275rem;
    background-color: #404040;
    border-radius: 4px;
  }
  .year, .runtime, .broadcasts, .contributor {
    text-align: center;
  }
  .year, .runtime {
    padding: 0 0.2rem;
  }
  .contributor {
    white-space: nowrap;
  }
</style>
