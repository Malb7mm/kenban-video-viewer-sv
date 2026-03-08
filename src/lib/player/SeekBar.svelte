<script lang="ts">
    import { onMount } from "svelte";

  let { duration, onseeked }: {
    duration: number,
    onseeked?: (value: number) => void,
  } = $props();

  let inputEl: HTMLInputElement | undefined = $state(undefined);
  let time = $state(0);
  let hoverText: string = $state("");
  let hoverX: number = $state(0);
  let showToolTip: boolean = $state(false);

  const handleInput = (event: Event) => {
    time = parseFloat(inputEl?.value || "0");
    onseeked?.(time);
    updateBar();
  };
  
  export const setProgress = (value: number) => {
    time = value;
    updateBar();
  };

  const updateBar = () => {
    if (inputEl === undefined) return;

    const val = time;
    const min = parseFloat(inputEl.min);
    const max = parseFloat(inputEl.max);

    let progress = 0;
    if (max > min) {
      progress = (val - min) / (max - min) * 100;
    }
    inputEl.style.setProperty('--progress', `${progress}%`);
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (inputEl === undefined) return;
    const rect = inputEl.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const ratio = x / rect.width;
    const time = ratio * duration;
    hoverText = `${formatTime(time)} / ${formatTime(duration)}`;
    hoverX = x;
    showToolTip = (0 <= ratio && ratio <= 1);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  onMount(() => {
    updateBar();
  });
</script>

<div class="tw:size-full tw:relative">
  <input
    bind:this={inputEl}
    type="range"
    class="seek-bar"
    oninput={handleInput}
    onmousemove={handleMouseMove}
    onmouseleave={() => {showToolTip = false;}}
    min="0"
    max="{duration}"
    step="0.1"
    bind:value={time}
  >
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