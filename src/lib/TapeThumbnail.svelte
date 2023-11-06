<script lang="ts">
  import { navigate } from 'svelte-routing'
  import { type Tape } from '../state/tapes'
  export let tape: Tape
  let focused = false
  let hovered = false
</script>

<div
  class="container"
  style={`background-color: ${tape.color}`}
  role="button"
  tabindex={tape.id}
  on:focus={() => { focused = true }}
  on:blur={() => { focused = false }}
  on:mouseenter={() => { hovered = true }}
  on:mouseleave={() => { hovered = false; focused = false }}
  on:click={() => navigate(`/tapes/${tape.id}`)}
  on:keydown={(e) => {
    if (e.key === 'Enter') {
      navigate(`/tapes/${tape.id}`)
    }
  }}
>
  <img src={tape.thumbnailImage} alt={`Preview image for tape ${tape.id}`} loading="lazy" />
{#if tape.broadcastIds.length > 0}
  <div class="screened-overlay" style={`background-color: ${tape.color}`}>
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,0 64,0 64,64" fill="#242424" stroke="none" />
    </svg>
  </div>
{/if}
{#if hovered || focused}
  <div class="overlay">
    <p style={`background-color: ${tape.color}88`}>{tape.title}</p>
  </div>
{/if}
{#if tape.onToggleFavorite !== null}
  <button class={`heart${tape.isFavorite ? ' favorited' : ''}`} on:click={(e) => {
    if (tape.onToggleFavorite) {
      e.stopPropagation()
      tape.onToggleFavorite()
    }
  }}>
    {tape.isFavorite ? '\u2665' : '\u2661'}
  </button>
{/if}
</div>

<style>
  .container {
    flex: 0 0 198px;
    height: 360px;
    display: flex;
    justify-content: center;
    position: relative;
    cursor: pointer;
  }
  .screened-overlay {
    position: absolute;
    top: 0;
    right: 0;
    width: 64px;
    height: 64px;
    pointer-events: none;
  }
  button.heart {
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
    color: #cccccc99;
    background-color: #24242433;
    border-width: 0;
    border-radius: 0.25rem;
    padding: 0 0.25rem;
    margin: 0;
    font-size: 2rem;
    line-height: 1.0;
  }
  button.heart.favorited {
    color: #fff;
    background-color: #24242499;
  }
  button.heart:hover {
    color: #fff;
  }
  button.heart.favorited:hover {
    color: #ccc;
  }
  img {
    max-width: 100%;
  }
  .overlay {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  p {
    line-height: 1.1;
    text-align: center;
    font-weight: 500;
    padding: 10px;
    text-shadow: 1px 1px #00000088;
  }
  @media only screen and (max-width: 696px) {
    .container {
      flex-basis: 143px;
      height: 260px;
    }
  }
</style>
