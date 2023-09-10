<script lang="ts">
  export let images: {url: string, alt: string}[]
</script>

<div class="container">
{#each images as image}
  <div class="image">
    <img src={image.url} alt={image.alt} />
  </div>
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
</style>
