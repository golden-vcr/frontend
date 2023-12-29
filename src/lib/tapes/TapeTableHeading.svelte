<script lang="ts">
  export let text: string
  export let expand = false
  export let isSortCriteria: boolean
  export let isSortedDescending: boolean
  export let onClick: () => void

  $: classes = [
    expand ? 'expand' : '',
    isSortCriteria ? 'active': '',
  ].filter((x) => !!x).join(' ')
</script>

<th class={classes} on:click={onClick}>
  <div class="content">
    <div class="label">{text}</div>
    <div class="sort-icon">
      {isSortCriteria ? (isSortedDescending ? '\u25b2' : '\u25bc') : '\xa0'}
    </div>
  </div>
</th>

<style>
  th {
    cursor: pointer;
    border-bottom: 2px solid #404040;
    padding: 0.5rem 0.2rem 0.2rem 0.2rem;
  }
  th:hover {
    background-color: #404040;
  }
  .expand {
    width: 100%;
  }
  .active {
    border-bottom-color: #eee;
  }
  .content {
    display: flex;
    flex-direction: column;
  }
  .label {
    line-height: 1;
  }
  .sort-icon {
    line-height: 1;
    font-size: 0.875rem;
    color: #ccc;
  }
</style>
