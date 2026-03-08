<script lang="ts">
  import ChevronLeft from "../assets/ChevronLeft.svelte";
  import ChevronRight from "../assets/ChevronRight.svelte";

  let isOpen: boolean = $state(false);
</script>

<div 
  class="tw:h-[calc(100%-3rem)] tw:w-120 tw:max-w-[80vw]
         tw:absolute tw:right-0 tw:top:0 tw:pointer-events-auto
         drawer"
  class:open={isOpen}
>
  <!--背景-->
  <div class="tw:size-full tw:bg-p800 tw:opacity-95 tw:rounded-bl-lg"></div>

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