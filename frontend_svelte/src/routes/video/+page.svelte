<script lang="ts">
  let url =
    "https://de25.seedr.cc/ff_get/5446980916/The%20Orville%20S02E01%20Jaloja%20%20(1080p%20x265%2010bit%20FS96%20Joy).mkv?st=_8qB9xh-_CzHo3d5seMgEg&e=1718513704";
  let loaded = false;
  function loadVideo() {
    loaded = true;
  }
</script>

<div>
  <input class="input" bind:value={url} /><button on:click={loadVideo}
    >Load</button
  >
</div>
{#if loaded}
  <div>
    <video controls width="800">
      <track kind="captions" />
      <source src={url} type="video/mp4; codecs=hvc1" /></video
    >
  </div>
{/if}
