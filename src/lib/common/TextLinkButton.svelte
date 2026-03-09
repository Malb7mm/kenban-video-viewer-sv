<script lang="ts">
  import type { Snippet } from "svelte";

  let { onclick, children }: {
    onclick?: (e: Event) => void,
    children?: Snippet,
  } = $props();
</script>

<button class="textlink-button" onclick={onclick}>
  {@render children?.()}
</button>

<style>
.textlink-button {
  background: none;
  border: none;
  padding: 0;
  font: inherit;

  color: var(--tw-color-s300);
  text-decoration: underline;
  cursor: pointer;
}

.textlink-button:hover {
  color: var(--tw-color-s500);
}
</style>