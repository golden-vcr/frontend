<script lang="ts">  
  import { type Tape } from '../tapes/index'

  import Tag from './Tag.svelte'
  import ImageGallery from './ImageGallery.svelte'

  export let tape: Tape
</script>

<div class="container">
  <h1>{tape.title}</h1>
  <div class="tags">
{#each tape.tags as tag}
    <Tag {tag} />
{/each}
  </div>
  <div class="info">
    GVCR #{String(tape.id).padStart(3, '0')}:
    {tape.runtime ? `${tape.runtime} minutes` : 'Unknown runtime'},
    {tape.year ? `${tape.year}` : 'unknown year'}
  </div>
  <ImageGallery images={tape.images} />
</div>

<style>
  .container {
    flex: 1;
    padding: 2rem;
    display: flex;
    flex-direction: column;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    padding: 0.5rem;
    gap: 0.5rem;
  }
  h1 {
    font-size: 1.75rem;
    line-height: 1.0;
    margin: 0;
  }
  @media only screen and (max-width: 696px) {
    .container {
      padding: 1.5rem;
    }
    h1 {
      font-size: 1.5rem;
      margin-bottom: 0.25rem;
    }
  }
</style>
