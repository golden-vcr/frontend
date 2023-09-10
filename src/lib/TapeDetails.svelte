<script lang="ts">  
  import ImageGallery from './ImageGallery.svelte'
  import { type Tape } from '../tapes/index'
  export let tape: Tape
</script>

<div>
  <h2>{tape.title}</h2>
  <ImageGallery
    images={tape.images.map((url) => ({
      url,
      alt: `Full-size image for tape ${tape.id}`,
    }))}
  />
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
  }
  h2 {
    padding: 0 2rem;
  }
</style>
