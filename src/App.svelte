<script lang="ts">
  import Drawer from "./lib/drawer/Drawer.svelte";
  import Player from "./lib/player/Player.svelte";
  import { createLoopSystem } from "./lib/features/loop.svelte";
  import { setContext } from "svelte";
  import { createSharedMetadata } from "./lib/common/utils";

  let playerEl: Player | undefined = $state(undefined);

  const loopSystem = createLoopSystem();
  setContext("loopSystem", loopSystem);

  const sharedMetadata = $state(createSharedMetadata());
  setContext("sharedMetadata", sharedMetadata);
</script>

<main 
  class="tw:relative tw:size-full tw:bg-p900
         tw:flex tw:flex-col" 
  ondragenter={(e: Event) => { e.preventDefault(); }} 
  ondragover={(e: Event) => { e.preventDefault(); }} 
  ondrop={playerEl?.handleFileDrop}>
  <div class="tw:size-full">
    <Player 
      bind:this={playerEl}
    ></Player>
  </div>
  <div class="tw:absolute tw:size-full tw:inset-0 tw:pointer-events-none">
    <Drawer></Drawer>
  </div>
</main>