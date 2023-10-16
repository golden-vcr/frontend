<script lang="ts">
  export let twitchDisplayName: string
  export let twitchProfileImageUrl: string

  $: profileImageSrc = twitchProfileImageUrl || "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
</script>

<div>
  <img alt={`Profile image for ${twitchDisplayName}`} src={profileImageSrc} />
  <span>{twitchDisplayName}</span>
</div>

<style>
  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem;
  }
  img {
    width: 30px;
    height: 30px;
    border-radius: 30px;
  }
  @media only screen and (max-width: 696px) {
    span {
      display: none;
    }
  }
</style>
