<script lang="ts">
  import { Link } from "svelte-routing"

  export let to: string
  export let onClick: () => void
</script>

<Link
  {to}
  on:click={onClick}
>
  <slot />
</Link>
