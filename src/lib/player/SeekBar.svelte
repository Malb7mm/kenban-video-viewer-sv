<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { formatTime, type SharedMetadata } from "../common/utils";
  import type { LoopSystem } from "../features/loop.svelte";

  let { currentTime = $bindable(), onseeked }: {
    currentTime: number,
    onseeked?: (value: number) => void,
  } = $props();

  const loopSystem = getContext<LoopSystem>("loopSystem");
  const sharedMetadata = getContext<SharedMetadata>("sharedMetadata");
  let duration = $derived(sharedMetadata?.duration || 0);
  $inspect(duration).with(console.log);

  let inputEl: HTMLInputElement | undefined = $state(undefined);
  let hoverText: string = $state("");
  let hoverX: number = $state(0);
  let showToolTip: boolean = $state(false);

  const handleInput = (event: Event) => {
    currentTime = parseFloat(inputEl?.value || "0");
    onseeked?.(currentTime);
    updateBar();
  };
  
  export const setProgress = (value: number) => {
    currentTime = value;
    updateBar();
  };

  const calcProgressRatio = (time: number) => {
    if (duration === 0) return 0;
    return time / duration;
  };

  const convertTimeToPx = (time: number) => {
    if (inputEl === undefined) return undefined;
    const rect = inputEl.getBoundingClientRect();
    const ratio = calcProgressRatio(time);
    return ratio * rect.width;
  };

  const convertPxToTime = (px: number) => {
    if (inputEl === undefined) return undefined;
    const rect = inputEl.getBoundingClientRect();
    const ratio = px / rect.width;
    return ratio * duration;
  };

  const updateBar = () => {
    if (inputEl === undefined) return;
    const progress = calcProgressRatio(currentTime) * 100;
    inputEl.style.setProperty('--progress', `${progress}%`);
  };

  const handleSeek = (event: MouseEvent) => {
    if (inputEl === undefined) return;
    const rect = inputEl.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const time = convertPxToTime(x) || 0;
    hoverText = `${formatTime(time)} / ${formatTime(duration)}`;
    hoverX = x;
    showToolTip = (0 <= x && x <= rect.width);
  };

  let holdingLoopHandle: "from" | "to" | undefined = $state(undefined);

  const handleClickLoopHandle = (event: MouseEvent, side: "from" | "to") => {
    holdingLoopHandle = side;
    handleMoveLoopHandle(event);
  };

  const handleMoveLoopHandle = (event: MouseEvent) => {
    if (holdingLoopHandle === undefined) return;
    if (loopSystem.index === undefined) return;
    if (inputEl === undefined) return;
    const rect = inputEl.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const time = convertPxToTime(x) || 0;

    if (holdingLoopHandle === "from") {
      if (0 <= time && time < loopSystem.current.to!) {
        loopSystem.updateItem(loopSystem.index, { from: time });
      }
    }
    if (holdingLoopHandle === "to") {
      if (loopSystem.current.from! < time && time <= duration) {
        loopSystem.updateItem(loopSystem.index, { to: time });
      }
    }
  }

  const handleReleaseLoopHandle = () => {
    holdingLoopHandle = undefined;
  };

  let loopRangeL = $derived(convertTimeToPx(loopSystem.current.from || 0) || 0);
  let loopRangeR = $derived(convertTimeToPx(loopSystem.current.to || 0) || 0);
  let loopRangeW = $derived(loopRangeR - loopRangeL);

  onMount(() => {
    updateBar();

    window.addEventListener("mousemove", handleMoveLoopHandle);
    window.addEventListener("mouseup", handleReleaseLoopHandle);
    return (() => {
      window.removeEventListener("mousemove", handleMoveLoopHandle);
      window.removeEventListener("mouseup", handleReleaseLoopHandle);
    });
  });
</script>

<div class="tw:size-full tw:relative tw:select-none">
  <input
    bind:this={inputEl}
    type="range"
    class="seek-bar"
    oninput={handleInput}
    onmousemove={handleSeek}
    onmouseleave={() => {showToolTip = false;}}
    min="0"
    max="{duration}"
    step="0.1"
    bind:value={currentTime}
  >
  {#if loopSystem.index !== undefined}
    <div
      class="tw:bg-s300 tw:opacity-50 tw:pointer-events-none
             tw:absolute tw:bottom-full tw:h-4"
      style="left: {loopRangeL}px; width: {loopRangeW}px;">
    </div>
    <div
      class="tw:bg-s300 tw:pointer-events-none
             tw:border-s900 tw:border
             tw:absolute tw:-translate-x-1/2 tw:bottom-0 tw:h-9 tw:w-1"
      style="left: {loopRangeL}px;">
    </div>
    <div
      class="tw:bg-s300 tw:pointer-events-none
             tw:border-s900 tw:border
             tw:absolute tw:-translate-x-1/2 tw:bottom-0 tw:h-9 tw:w-1"
      style="left: {loopRangeR}px;">
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events すみま -->
    <!-- svelte-ignore a11y_no_static_element_interactions せん -->
    <div
      class="tw:pointer-events-auto tw:cursor-ew-resize tw:opacity-0
             tw:absolute tw:-translate-x-1/2 tw:bottom-full tw:h-4 tw:w-4"
      style="left: {loopRangeL}px;"
      onmousedown={e => {handleClickLoopHandle(e, "from")}}
      onmouseup={handleReleaseLoopHandle}>
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events すみま -->
    <!-- svelte-ignore a11y_no_static_element_interactions せん -->
    <div
      class="tw:pointer-events-auto tw:cursor-ew-resize tw:opacity-0
             tw:absolute tw:-translate-x-1/2 tw:bottom-full tw:h-4 tw:w-4"
      style="left: {loopRangeR}px;"
      onmousedown={e => {handleClickLoopHandle(e, "to")}}
      onmouseup={handleReleaseLoopHandle}>
    </div>
  {/if}
  {#if showToolTip}
    <div
      class="tw:bg-p800 tw:text-p300 tw:pointer-events-none tw:whitespace-nowrap
             tw:absolute tw:-translate-x-1/2 tw:bottom-full tw:text-sm tw:px-2
             tw:inset-shadow-[0_0_0.5rem] tw:inset-shadow-p950"
      style:left="{hoverX}px">
      {hoverText}
    </div>
  {/if}
</div>

<style>
.seek-bar {
  appearance: none;
  width: 100%;
  height: 100%;
  --progress: 0%;
  background: linear-gradient(to right, var(--tw-color-p400) var(--progress), var(--tw-color-p600) var(--progress));
}

.seek-bar::-webkit-slider-thumb {
  opacity: 0;
}
</style>