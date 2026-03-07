<script lang="ts">
  import Player from "./lib/Player.svelte";

  let player: Player;

  const preventDefault = (e: Event) => {e.preventDefault();};
</script>

<main 
  class="tw:relative tw:size-full tw:bg-p900
         tw:flex tw:flex-col" 
  ondragenter={preventDefault} 
  ondragover={preventDefault} 
  ondrop={player.handleFileDrop}>
  <div class="tw:size-full">
    <Player 
      bind:this={player}
    ></Player>
  </div>
</main>