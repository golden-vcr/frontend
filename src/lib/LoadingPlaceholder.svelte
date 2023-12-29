<script lang="ts">
  export let length = 32
  export let plus = 0

  function makeText(): string {
    const n = length + Math.trunc(Math.random() * plus)
    let s = ''
    let wordlen = 0
    for (let i = 0; i < n; i++) {
      s += 'o'
      wordlen++
      if (wordlen > 5 && Math.random() < 0.5) {
        s += ' '
        wordlen = 0
      }
    }
    return s
  }

  const text = makeText()
</script>

<span>
  {text}
</span>

<style>
  span {
    background-color: #404040;
    color: #404040;
    border-radius: 8px;
  }
</style>
