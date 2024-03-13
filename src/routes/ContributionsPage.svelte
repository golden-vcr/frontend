<script lang="ts">
  import { Link } from 'svelte-routing'

  const contributionsOpen = false
</script>

<h1>Contributions</h1>
{#if contributionsOpen}
<p>
  If you'd like to contribute VHS tapes to the Golden VCR archive, you're welcome to
  send them to:
</p>
<div class="address">
  Alex Forsythe<br />
  150 Wrenn Dr #1973<br />
  Cary, NC 27512
</div>
<p>
  When entering or writing the shipping address, please be sure to render it exactly as
  shown above: USPS insists that the Box number be written as <b>#1973</b>, and not as
  <b>Box 1973</b>, <b>Unit 1973</b>, etc.
</p>
<p class="immediate">
  Please keep the following guidelines in mind when sending tapes:
</p>
<ul class="immediate">
  <li>
    &#x1fa99; Tapes are accepted as donations: you will not be compensated monetarily,
    although you may be credited with Golden VCR Fun Points as a gesture of thanks.
  </li>
  <li>
    &#x1f914; Tapes may or may not be added to the Golden VCR Library: we have to make a
    judgment call based on the tape's content, condition, etc.
  </li>
  <li>&#x2705; We'd be very grateful to receive:</li>
  <ul>
    <li>Weird or obscure media</li>
    <li>Promotional, instructional, and educational tapes</li>
    <li>Personal VCR recordings of television broadcasts</li>
    <li>Home video recordings of events, etc.</li>
  </ul>
  <li>&#x274c; We ask that you please refrain from sending:</li>
  <ul>
    <li>Home video releases of popular movies or television shows</li>
    <li>Tapes that are already in the Golden VCR Library (you can search on the <Link to="/tapes">Tapes</Link> page to see what's already in the collection)</li>
  </ul>
</ul>
{:else}
<p>
  A great many of the tapes in the Golden VCR library have been mailed in by viewers who
  wish to spread the love of VHS and broaden our cultural horizons, allowing us to watch
  a more diverse range of tapes from around the world. These generous contributions are
  greatly appreciated.
</p>
<p>
  However, for the time being, submissions are temporarily closed. Thank you for your
  patience and understanding as we work our way through the existing backlog and free up
  space for future submissions.
</p>
{/if}

<style>
  h1 {
    font-size: 1.75rem;
    line-height: 1.0;
    margin: 0;
  }
  .address {
    margin-left: 1rem;
    padding-left: 1rem;
    border-left: 3px solid #ccc;
  }
  .immediate {
    margin-top: 0;
  }
</style>
