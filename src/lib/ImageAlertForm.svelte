<script lang="ts">
  import { authorizedFetch } from '../auth'
  import { balance } from '../state/balance'

  let subjectText = ''
  let submissionError = ''
  let submissionState = 'idle' as 'idle' | 'pending' | 'failed' | 'ok'

  async function requestImageGenerationAlert(subject: string) {
    submissionState = 'pending'
    const r = await authorizedFetch('/api/showtime/image-gen', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ subject })
    })

    if (!r.ok) {
      let message = ''
      try {
        message = await r.text()
      } catch (ignored) {
      }
      const suffix = message ? `: ${message}` : ''
      submissionState = 'failed'
      throw new Error(`Got status ${r.status} from POST /image-gen${suffix}`)
    }
    submissionState = 'ok'
  }
</script>

<fieldset>
  <p>
    For only 500 points, you can send a ghostly apparition to haunt my VCR! Simply
    describe what you'd like to see and click <b>Submit</b>:
  </p>
  <input
    type="text"
    bind:value={subjectText}
    disabled={$balance.numPointsAvailable < 500}
  />
  <button
    disabled={$balance.numPointsAvailable < 500 || submissionState === 'pending' || subjectText.length <= 0 || subjectText.length > 120}
    on:click={() => requestImageGenerationAlert(subjectText)}
  >
    Submit
  </button>
{#if submissionState === 'pending'}
  <p>Submission in progress...</p>
{:else if submissionState === 'ok'}
  <p>Submission successful! Your image will appear on the stream shortly.</p>
{:else if submissionState === 'failed'}
  <p>Submission failed! No points have been deducted from your balance.</p>
{/if}
{#if submissionError}
  <p><b>ERROR:</b> {submissionError}</p>
{/if}
</fieldset>

<style>
  input {
    line-height: 2.0;
    font-size: 1em;
  }
</style>
