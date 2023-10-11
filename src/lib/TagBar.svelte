<script lang="ts">
  import Tag from './Tag.svelte'

  export let tags: string[]
</script>

<div>
{#each tags as tag}
  <Tag {tag} />
{/each}
</div>

<style>
  div {
    display: flex;
    gap: 0.2rem;
  }
</style>
