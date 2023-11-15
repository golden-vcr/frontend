<script lang="ts">
  import { type ImageRequest } from '../apis/showtime/history'
  import ImageRequestListItem from './ImageRequestListItem.svelte'
  export let requests: ImageRequest[]
</script>

<div>
{#each requests as request}
  <ImageRequestListItem {request} />
{/each}
</div>

<style>
  div {
    padding: 1rem;
  }
</style>