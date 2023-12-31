<script lang="ts">
  import { type Tape } from '../state/tapes'
  
  import TagHeading from './TagHeading.svelte'
  import CondensedTapeList from './CondensedTapeList.svelte'
  import TapeList from './TapeList.svelte'

  export let tapes: Tape[]
  export let condensed: boolean
  export let byCategory: boolean

  export let includeTapesWithBroadcastHistory: boolean

  function filterTapes(tapes: Tape[]): Tape[] {
    if (includeTapesWithBroadcastHistory) {
      return tapes
    }
    return tapes.filter((x) => x.broadcastIds.length === 0)
  }

  function collectTags(acc: { [key: string]: true }, tape: Tape): { [key: string]: true } {
    let cur = {} as { [key: string]: true }
    for (const tag of tape.tags) {
      cur[tag] = true
    }
    return { ...acc, ...cur }
  }
  $: tags = Object.keys(tapes.reduce(collectTags, {})).sort((a, b) => a.localeCompare(b))

  function collectSections(tapes: Tape[], tags: string[], byCategory: boolean): {tapes: Tape[], tag?: string}[] {
    if (!byCategory) {
      return [{ tapes }]
    }
    const sections = [] as {tapes: Tape[], tag: string}[]
    for (const tag of tags) {
      sections.push({
        tag,
        tapes: tapes.filter((x) => x.tags.includes(tag))
      })
    }
    return sections
  }
  $: sections = collectSections(filterTapes(tapes), tags, byCategory)
</script>

<div class="container">
{#each sections as section}
  <div class="section">
{#if section.tag}
    <TagHeading tag={section.tag} />
{/if}
{#if condensed}
    <CondensedTapeList tapes={section.tapes} />
{:else}
    <TapeList tapes={section.tapes} />
{/if}
  </div>
{/each}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
