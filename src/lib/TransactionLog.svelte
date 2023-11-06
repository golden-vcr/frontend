<script lang="ts">
  import { onMount } from 'svelte'
  import { fetchLedgerTransactionHistory, createLedgerNotificationsSource, type LedgerTransaction } from '../apis/ledger/records'
  import { refreshBalance } from '../ledger'

  let isLoadingInitialHistory = true
  let isFetchingNextPage = false
  let errorMessage = ''
  let nextCursor = undefined as string | undefined
  let items = [] as LedgerTransaction[]
  let source = null as EventSource | null

  async function fetchNextPage() {
    try {
      const result = await fetchLedgerTransactionHistory(nextCursor)
      nextCursor = result.nextCursor
      items = [...items].concat(result.items)
    } catch (err) {
      errorMessage = (err instanceof Error) ? err.message : String(err)
    }
  }

  onMount(() => {
    fetchNextPage().then(() => { isLoadingInitialHistory = false })
    createLedgerNotificationsSource({
      onTransaction(item) {
        const i = items.findIndex((x) => x.id === item.id)
        if (i >= 0) {
          items = items.slice(0, i).concat([item]).concat(items.slice(i + 1))
        } else {
          items = [item].concat([...items])
        }
        refreshBalance()
      },
      onError(err) {
        errorMessage = err.message
      },
    }).then((s) => {
      source = s
    })
    return () => {
      if (source) {
        source.close()
      }
    }
  })
</script>

<div class="container">

{#if errorMessage}
  <div class="error">
    {errorMessage}
  </div>
{/if}

{#if isLoadingInitialHistory}
  <p>Loading...</p>
{:else}
{#if items.length > 0}
  <table>
    <thead>
      <tr>
        <th class="col-time">Time</th>
        <th class="col-points">Points</th>
        <th class="col-state">State</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
{#each items as transaction}
      <tr>
        <td class="col-time">{transaction.timestamp.toLocaleString()}</td>
        <td class="col-points">{transaction.deltaPoints}</td>
        <td class="col-state">{transaction.state}</td>
        <td>{transaction.description}</td>
      </tr>
{/each}
    </tbody>
  </table>
{#if nextCursor && !isFetchingNextPage}
  <button on:click={() => {
    isFetchingNextPage = true
    fetchNextPage().finally(() => {
      isFetchingNextPage = false
    })
  }}>
    Load more
  </button>
{/if}
{:else}
  <p>No transactions to display.</p>
{/if}
{/if}

</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
  }
  .error {
    border: 2px solid red;
  }
  table {
    table-layout: fixed;
  }
  .col-time {
    width: 12em;
  }
  .col-points {
    width: 4em;
  }
  .col-state {
    width: 8em;
  }
</style>