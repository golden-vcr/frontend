<script lang="ts">  
  import { type Tape } from '../tapes/index'
  import { authorizedFetch } from '../auth'

  import Tag from './Tag.svelte'
  import ImageGallery from './ImageGallery.svelte'

  export let tape: Tape
  export let showAdminControls: boolean

  let isActivating = false
  let tapeActivationMessage = ''
  function activateTape(tapeId: number) {
    isActivating = true
    authorizedFetch(`/api/showtime/admin/tape/${tapeId}`, { method: 'POST' })
      .then((r) => {
        isActivating = false
        tapeActivationMessage = ''
        if (r.status == 204) {
          tapeActivationMessage = 'Tape activated!'
        } else {
          r.text().then((text) => {
            tapeActivationMessage = `Got response ${r.status}: ${text}`
          }).catch(() => {
            tapeActivationMessage = `Got response ${r.status}`
          })
        }
      })
      .catch((err) => {
        isActivating = false
        tapeActivationMessage = `ERROR: ${err}`
      })
  }
</script>

<div class="container">
  <h1>{tape.title}</h1>
  <div class="tags">
{#each tape.tags as tag}
    <Tag {tag} />
{/each}
  </div>
  <div class="info">
    GVCR #{String(tape.id).padStart(3, '0')}:
    {tape.runtime ? `${tape.runtime} minutes` : 'Unknown runtime'},
    {tape.year ? `${tape.year}` : 'unknown year'}
  </div>
{#if showAdminControls}
  <div class="admin-controls">
    <button disabled={isActivating} on:click={() => activateTape(tape.id)}>Activate Tape {tape.id}</button>
    <p>{tapeActivationMessage}</p>
  </div>
{/if}
  <ImageGallery images={tape.images} />
</div>

<style>
  .container {
    flex: 1;
    padding: 2rem;
    display: flex;
    flex-direction: column;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    padding: 0.5rem;
    gap: 0.5rem;
  }
  h1 {
    font-size: 1.75rem;
    line-height: 1.0;
    margin: 0;
  }
  .admin-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .admin-controls p {
    margin: 0;
  }
  @media only screen and (max-width: 696px) {
    .container {
      padding: 1.5rem;
    }
    h1 {
      font-size: 1.5rem;
      margin-bottom: 0.25rem;
    }
  }
</style>
