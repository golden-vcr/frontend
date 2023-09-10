<script lang="ts">
  export let images: {url: string, alt: string}[]
</script>

<div
  class="container"
  on:wheel={(e) => {
    if (e.deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
      if (e.deltaX === 0 && e.deltaZ === 0 && e.deltaY !== 0) {
        e.preventDefault()
        e.currentTarget.scrollBy(e.deltaY, 0)
      }
    }
  }
}>
{#each images as image}
  <img src={image.url} alt={image.alt} />
{/each}
</div>

<style>
  .container {
    flex: 1;
    background-color: #101010;
    border-top: 2px solid #363636;
    border-bottom: 2px solid #363636;
    padding: 20px;
    gap: 20px;
    overflow-x: scroll;
    display: flex;
  }
  img {
    object-fit: contain;
  }
</style>
