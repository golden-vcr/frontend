<script lang="ts">
  import { formatTagName, getTagColor } from "../tags";

  export let tag: string
  $: color = getTagColor(tag)
</script>

<div style={`background-color: ${color}`}>
  {formatTagName(tag)}
</div>

<style>
  div {
    border-radius: 4px;
    line-height: 1;
    padding: 0.5rem;
    font-size: 1.25rem;
    font-weight: bold;
    text-shadow: rgba(0, 0, 0, 0.5) 1px 1px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.25));
  }
</style>
