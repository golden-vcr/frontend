<script lang="ts">
  import { Link } from "svelte-routing"

  export let to: string
  export let onClick: (() => void) | undefined = undefined
</script>

<Link
  {to}
  on:click={() => {
    if (onClick) {
      onClick()
    }
  }}
>
  <slot />
</Link>
