<script lang="ts">
  import type { Snippet } from "svelte";

  let { checked = $bindable(false), children }: {
    checked?: boolean,
    children?: Snippet,
  } = $props();
</script>

<label class="tw:flex tw:flex-row tw:items-center tw:gap-3 tw:group">
  <input 
    type="checkbox" 
    bind:checked 
    class="tw:sr-only"
  />
  <div class="
    tw:relative tw:w-12 tw:h-6 tw:rounded-sm tw:transition-all tw:duration-200
    tw:bg-p600 tw:group-has-checked:bg-s700  
  ">
    <div class="
      tw:absolute tw:left-1 tw:top-1 tw:size-4 tw:rounded-sm tw:transition-all tw:duration-200
      tw:bg-p400 tw:group-has-checked:bg-s300
      tw:group-has-checked:translate-x-6
    ">
    </div>
  </div>
  {@render children?.()}
</label>