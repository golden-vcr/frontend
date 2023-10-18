<script lang="ts">
  import { type TapeImage } from '../tapes'
  export let images: TapeImage[]
</script>

<div class="container">
{#each images as image}
  <div class="frame" style={`width: ${image.width}px`}>
    <img src={image.url} alt={image.alt} />
  </div>
{/each}
</div>

<style>
  .container {
    margin-top: 0.75em;
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
  }
  .frame {
    max-width: 100%;
    max-height: 100%;
  }
  img {
    max-width: 100%;
    max-height: 100%;
  }
  @media only screen and (max-width: 696px) {
    .container {
      gap: 0.2rem;
      padding: 0;
    }
  }
</style>
