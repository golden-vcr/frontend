<script lang="ts">
  import { type ImageRequest } from '../apis/showtime/history'
  import { images, requestImageUrls } from '../state/images'

  export let request: ImageRequest

  let expanded = false
  let hasEverBeenExpanded = false

  function toggleExpanded() {
    expanded = !expanded
    if (!hasEverBeenExpanded && expanded) {
      hasEverBeenExpanded = true
      requestImageUrls(request.id)
    }
  }

  $: imageUrls = $images[request.id] || []
</script>

<div class="container" role="button" tabindex="0" on:click={toggleExpanded} on:keypress={toggleExpanded}>
  {expanded ? '\u25be' : '\u25b8'} <b>{request.username}:</b> {request.subject}
</div>
{#if expanded}
<div class="gallery">
{#each imageUrls as url}
  <img src={url} alt="Computer-generated" />
{/each}
</div>
{/if}

<style>
  .container {
    cursor: pointer;
  }
  .container:hover {
    text-decoration: underline;
  }
  .gallery {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .gallery img {
    max-width: 20%;
  }
  @media only screen and (max-width: 696px) {
    .gallery {
      flex-direction: column;
    }
    .gallery img {
      max-width: 100%;
    }
  }
</style>
