<script lang="ts">
  import { formatTagName, getTagColor } from "../tags";

  export let tag: string
  export let small = false
  $: color = getTagColor(tag)
</script>

<div class={small ? 'small' : undefined} style={`background-color: ${color}`}>
  {formatTagName(tag)}
</div>

<style>
  div {
    border-radius: 4px;
    line-height: 1;
    padding: 0.3em;
    font-weight: bold;
    text-shadow: rgba(0, 0, 0, 0.5) 1px 1px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.25));
    white-space: nowrap;
  }
  .small {
    font-size: 0.875rem;
  }
  @media only screen and (max-width: 696px) {
    div {
      font-size: 0.875rem;
    }
  }
</style>