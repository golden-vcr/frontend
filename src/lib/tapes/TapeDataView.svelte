<script lang="ts">
  import { onMount } from 'svelte';

  import { initTapes, tapes, type Tape } from '../../state/tapes'

  import TapeDataViewItem from './TapeDataViewItem.svelte';
  import { authorizedFetch } from '../../auth';
  import { fade } from 'svelte/transition';

  let tapeId = 1
  $: tape = $tapes.find((x) => x.id === tapeId) || null
  $: maxTapeId = $tapes.reduce((acc, x) => Math.max(acc, x.id), 0)

  let entryMode = null as null | 'goto' | 'find' | 'tag'
  let pendingEntry = ''

  let searchString = ''
  let matchIds = [] as number[]
  let matchIndex = -1

  let message = ''
  let clearMessageTimer = null as null | ReturnType<typeof setTimeout>

  function formatMatchMessage(): string {
    let s = `Matches for '${searchString}': `
    for (let i = 0; i < matchIds.length; i++) {
      if (i > 0) {
        s += ' '
      }
      if (i === matchIndex) {
        s += `[${matchIds[i]}]`
      } else {
        s += ` ${matchIds[i]} `
      }
    }
    return s
  }

  function clearMessage() {
    if (clearMessageTimer) {
      clearTimeout(clearMessageTimer)
      clearMessageTimer = null
    }
    message = ''
  }

  function showMessage(m: string) {
    clearMessage()
    message = m
    clearMessageTimer = setTimeout(clearMessage, 2000)
  }

  let pressedKey = ''
  let clearPressedKeyTimer = null as null | ReturnType<typeof setTimeout>

  function clearPressedKey() {
    if (clearPressedKeyTimer) {
      clearTimeout(clearPressedKeyTimer)
      clearPressedKeyTimer = null
    }
    pressedKey = ''
  }

  function showPressedKey(s: string) {
    clearPressedKey()
    pressedKey = s
    clearPressedKeyTimer = setTimeout(clearPressedKey, 100)
  }

  let taggedTapeIds = [] as number[]

  function toggleTag() {
    if (tape) {
      const isTagged = taggedTapeIds.includes(tape.id)
      if (isTagged) {
        taggedTapeIds = taggedTapeIds.filter((x) => x !== tape.id)
      } else {
        taggedTapeIds = [ ...taggedTapeIds, tape.id ].toSorted((a, b) => a - b)
      }
    }
  }

  // key input handling

  function handleGotoEntry(k: string) {
    if (k === 'Enter') {
      if (pendingEntry) {
        const nextTapeId = parseInt(pendingEntry)
        if (!isNaN(nextTapeId) && nextTapeId > 0 && nextTapeId <= maxTapeId) {
          tapeId = nextTapeId
          clearMessage()
        } else {
          showMessage('Invalid tape ID.')
        }
      }
      pendingEntry = ''
      entryMode = null
      return
    }

    if ('0123456789'.includes(k)) {
      pendingEntry += k
    } else if (k === 'Backspace') {
      if (pendingEntry.length > 0) {
        pendingEntry = pendingEntry.slice(0, pendingEntry.length - 1)
      }
    }
  }

  function handleFindEntry(k: string) {
    if (k === 'Enter') {
      if (pendingEntry) {
        searchString = pendingEntry
        const isMatch = (x: Tape) => x.title.toLowerCase().includes(searchString.toLowerCase())
        matchIds = $tapes.filter(isMatch).map((x) => x.id)
        if (matchIds.length > 0) {
          matchIndex = 0
          tapeId = matchIds[matchIndex]
          showMessage(formatMatchMessage())
        } else {
          matchIndex = -1
          showMessage(`No matches found for '${searchString}'`)
        }
      }
      pendingEntry = ''
      entryMode = null
      return
    }

    if ('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_,./;\'"() '.includes(k)) {
      pendingEntry += k
    } else if (k === 'Backspace') {
      if (pendingEntry.length > 0) {
        pendingEntry = pendingEntry.slice(0, pendingEntry.length - 1)
      }
    }
  }

  function handleTagEntry(k: string) {
    if (k === 'Enter') {
      if (pendingEntry) {
        commitSeriesName(pendingEntry, taggedTapeIds).then((ok) => {
          if (ok) {
            showMessage(`Tagged ${taggedTapeIds.length} tapes with series '${pendingEntry}'.`)
            taggedTapeIds = []
            if (searchString === '<TAGGED>') {
              searchString = ''
              matchIds = []
              matchIndex = -1
            }
            initTapes()
          }
          pendingEntry = ''
          entryMode = null
        })
      } else {
        pendingEntry = ''
        entryMode = null
      }
    }

    if ('0123456789abcdefghijklmnopqrstuvwxyz-'.includes(k)) {
      pendingEntry += k
    } else if (k === 'Backspace') {
      if (pendingEntry.length > 0) {
        pendingEntry = pendingEntry.slice(0, pendingEntry.length - 1)
      }
    }
  }

  async function commitSeriesName(seriesName: string, tapeIds: number[]): Promise<boolean> {
    const data = new URLSearchParams()
    data.set('seriesName', seriesName)
    data.set('tapeIds', tapeIds.join(','))
    try {
      const r = await authorizedFetch('/api/tapes/admin/apply-series', {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: data,
      })
      if (r.status < 200 || r.status > 299) {
        const text = await r.text()
        throw new Error(`Got ${r.status} response: ${text}`)
      }
      return true
    } catch (err) {
      console.log(err)
      showMessage(`ERROR: ${(err as Error).message}`)
      return false
    }
  }

  function handleEntry(k: string) {
    if (k === 'Escape') {
      showPressedKey('Esc')
      entryMode = null
      pendingEntry = ''
      return
    }

    switch (entryMode) {
      case 'goto':
        handleGotoEntry(k)
        break
      case 'find':
        handleFindEntry(k)
        break
      case 'tag':
        handleTagEntry(k)
        break
    }
  }

  function handleKey(k: string) {
    if (entryMode) {
      handleEntry(k)
      return
    }

    if (k === 'ArrowLeft' || k === 'ArrowRight') {
      showPressedKey(k === 'ArrowRight' ? String.fromCodePoint(0x0001F846) : String.fromCodePoint(0x0001F844))
      const delta = k === 'ArrowRight' ? 1 : -1
      const nextTapeId = tapeId + delta
      if (nextTapeId > 0 && nextTapeId <= maxTapeId) {
        tapeId = nextTapeId
        clearMessage()
      }
      return
    }

    if (k === 'g') {
      showPressedKey('G')
      entryMode = 'goto'
      return
    }

    if (k === 'f') {
      showPressedKey('F')
      entryMode = 'find'
      return
    }

    if ((k === 'p' || k === 'n') && matchIds.length > 0) {
      showPressedKey(k === 'n' ? 'N' : 'P')
      const delta = k === 'n' ? 1 : -1
      const nextMatchIndex = matchIndex + delta
      if (nextMatchIndex >= 0 && nextMatchIndex < matchIds.length) {
        matchIndex = nextMatchIndex
        tapeId = matchIds[matchIndex]
      }
      showMessage(formatMatchMessage())
      return
    }

    if (k === 't') {
      showPressedKey('T')
      toggleTag()
      return
    }

    if (k === 'd') {
      showPressedKey('D')
      if (taggedTapeIds.length > 0) {
        searchString = '<TAGGED>'
        matchIds = [...taggedTapeIds]
        matchIndex = 0
        tapeId = taggedTapeIds[0]
        showMessage(formatMatchMessage())
      } else {
        showMessage('No tapes are currently tagged.')
      }
      return
    }

    if (k === 'c') {
      showPressedKey('C')
      if (taggedTapeIds.length > 0) {
        entryMode = 'tag'
      } else {
        showMessage('No tapes are currently tagged.')
      }
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    handleKey(e.key)
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })
</script>

<div class="container">
{#if tape}
  <TapeDataViewItem
    {tape}
    isTagged={taggedTapeIds.includes(tape.id)}
  />
{:else}
  <p>Loading...</p>
{/if}
{#if entryMode || message}
  <div class="overlay">
    <div class="entry">
{#if entryMode === 'goto'}
      Go to tape: {pendingEntry}_
{:else if entryMode === 'find'}
      Find tape: {pendingEntry}_
{:else if entryMode === 'tag'}
      Commit tag: {pendingEntry}_
{:else if message}
      {message}
{/if}
    </div>
  </div>
{/if}
{#if pressedKey}
  <div class="key-overlay">
    <div out:fade class="key">
      {pressedKey}
    </div>
  </div>
{/if}
</div>

<style>
  .container {
    position: relative;
    height: 100%;
  }
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: end;
  }
  .entry {
    width: 100%;
    background-color: #ffffff33;
    padding: 0.5em;
    font-family: 'Consolas', monospace;
    white-space: pre;
  }
  .key-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: end;
  }
  .key {
    border: 4px solid #ffffff33;
    border-radius: 16px;
    padding: 0 1.25rem;
    background-color: #ffffff22;
    font-size: 4em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
