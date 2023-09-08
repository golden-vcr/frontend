<script lang="ts">
  import { type Tape } from "../tapes/index"
  export let tape: Tape
</script>

<div class="container" style={`background-color: ${tape.color}`}>
  <img src={tape.thumbnailImage} alt={`Preview image for tape ${tape.id}`} loading="lazy" />
  <div class="overlay">
    <p style={`background-color: ${tape.color}88`}>{tape.title}</p>
  </div>
</div>

<style>
  .container {
    width: 200px;
    aspect-ratio: 0.55;
    display: flex;
    justify-content: center;
    position: relative;
  }
  img {
    max-width: 100%;
  }
  .overlay {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  p {
    line-height: 1.1;
    text-align: center;
    font-weight: 500;
    padding: 10px;
    text-shadow: 1px 1px #00000088;
  }
  @media only screen and (max-width: 696px) {
    .container {
      width: 160px;
    }
    p {
      font-size: small;
    }
  }
  @media only screen and (max-width: 408px) {
    .container {
      width: 120px;
    }  
  }
  @media only screen and (min-width: 1600px) {
    .container {
      width: 275px;
    }
    p {
      font-size: larger;
      text-shadow: 2px 2px #00000088;
    }
  }
  p {
    margin-top: 0;
  }
</style>
