<script lang="ts">
  import { getContext } from "svelte";
  import ChevronLeft from "../../assets/ChevronLeft.svelte";
  import ChevronRight from "../../assets/ChevronRight.svelte";
  import LoopItemList from "./LoopItemList.svelte";
  import type { LoopSystem } from "../features/loop.svelte";
  import PlusIcon from "../../assets/PlusIcon.svelte";
  import Toggle from "../common/Toggle.svelte";
  import TextLinkButton from "../common/TextLinkButton.svelte";
  import type { SharedMetadata } from "../common/utils";

  const loopSystem = getContext<LoopSystem>("loopSystem");
  const sharedMetadata = getContext<SharedMetadata>("sharedMetadata");
  let duration = $derived(sharedMetadata?.duration || 0);

  let isOpen: boolean = $state(false);

  const addLoopItem = () => {
    loopSystem.addItem({ from: 0, to: duration, label: "新規ループアイテム" });
  };

  const deselectLoopItem = () => {
    loopSystem.index = undefined;
  }
</script>

<div 
  class="tw:h-[calc(100%-3rem)] tw:w-120 tw:max-w-[80vw]
         tw:absolute tw:right-0 tw:top:0 tw:pointer-events-auto
         drawer"
  class:open={isOpen}
>
  <!--背景-->
  <div class="tw:size-full tw:bg-p800 tw:opacity-95 tw:rounded-bl-lg"></div>

  <!--中身-->
  <div
    class="tw:absolute tw:inset-6
           tw:flex tw:flex-col tw:gap-10 tw:overflow-y-scroll"
  >
    <section
      class="tw:mx-4 tw:h-50"
    >
      <div class="tw:flex tw:flex-row tw:relative">
        <Toggle bind:checked={loopSystem.enabled}>
          ループ再生
        </Toggle>
        <div class="tw:absolute tw:right-10">
          <TextLinkButton onclick={deselectLoopItem}>選択解除</TextLinkButton>
        </div>
        <button
          class="tw:absolute tw:right-1 tw:h-5 tw:w-5 tw:rounded-md
                 tw:bg-p700 tw:hover:bg-p800
                 tw:grid tw:place-items-center"
          onclick={addLoopItem}
        >
          <PlusIcon size={14} color="var(--tw-color-p200)"></PlusIcon>
        </button>
      </div>
      <div class="tw:size-full tw:overflow-y-scroll">
        <LoopItemList></LoopItemList>
      </div>
    </section>
  </div>

  <!--開閉ハンドル-->
  <button
    class="tw:h-24 tw:w-10 tw:bg-p800 tw:hover:bg-p900 tw:rounded-l-xl
           tw:inset-shadow-[0_0_0.5rem] tw:inset-shadow-p950
           tw:absolute tw:right-full tw:top-1/2 tw:-translate-y-1/2
           tw:grid tw:place-items-center tw:text-white"
    onclick={() => { isOpen = !isOpen; }}
  >
    {#if isOpen}
      <ChevronRight size={18} color="var(--tw-color-p300)"></ChevronRight>
    {:else}
      <ChevronLeft size={18} color="var(--tw-color-p300)"></ChevronLeft>
    {/if}
  </button>
</div>

<style>
.drawer {
  transform: translateX(100%);
  transition: transform 0.5s;
}

.drawer.open {
  transform: translateX(0);
}
</style>