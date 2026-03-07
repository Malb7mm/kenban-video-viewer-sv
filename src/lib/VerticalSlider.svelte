<script lang="ts">
  import { onMount } from "svelte";

  let { min = 0, max = 100, step = 1, value = $bindable(0), onchange }: {
    min?: number,
    max?: number,
    step?: number,
    value?: number,
    onchange?: (value: number) => void,
  } = $props();

  let inputEl: HTMLInputElement | undefined = $state(undefined);

  const handleInput = (event: Event) => {
    value = parseFloat(inputEl?.value || "0");
    onchange?.(value);
    updateBar();
  };

  const updateBar = () => {
    if (inputEl === undefined) return;

    let progress = 0;
    if (max > min) {
      progress = (value - min) / (max - min) * 100;
    }
    inputEl.style.setProperty('--progress', `${progress}%`);
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
    min={min}
    max={max}
    step={step}
    bind:value={value}
  >
</div>

<style>
.seek-bar {
  appearance: none;
  writing-mode: vertical-rl;
  direction: rtl;
  width: 100%;
  height: 100%;
  --progress: 0%;
  background: linear-gradient(to top, var(--tw-color-p400) var(--progress), var(--tw-color-p600) var(--progress));
}

.seek-bar::-webkit-slider-thumb {
  opacity: 0;
}
</style>