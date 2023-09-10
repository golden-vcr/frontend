<script lang="ts">  
  import ImageGallery from './ImageGallery.svelte'
  import { type Tape } from '../tapes/index'
  export let tape: Tape
</script>

<div class="container">
  <h2>{tape.title}</h2>
  <ImageGallery
    images={tape.images.map((url) => ({
      url,
      alt: `Full-size image for tape ${tape.id}`,
    }))}
  />
</div>

<style>
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
  }
  h2 {
    padding: 0 2rem;
  }
</style>
