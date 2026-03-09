<script lang="ts">
  import { getContext } from "svelte";
  import type { LoopSystem } from "../features/loop.svelte";
  import { formatTime } from "../common/utils";
  import { flip } from "svelte/animate";
  import CloseIcon from "../../assets/CloseIcon.svelte";

  const loopSystem = getContext<LoopSystem>("loopSystem");

  let lastMoveAt: number = 0;
  const MOVE_THROTTLE_TIME = 80;

  const handleDragStart = (event: DragEvent, index: number) => {
    window.getSelection()?.removeAllRanges();
    loopSystem.index = index;
    if (event.dataTransfer !== null) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", index.toString());
      //ドラッグイメージ消す
      event.dataTransfer.setDragImage(new Image(), 0, 0);
    }
  };

  const handleDragEnter = (index: number) => {
    if (loopSystem.index === undefined) return;
    if (index === loopSystem.index) return;

    const now = Date.now();
    if (now - lastMoveAt < MOVE_THROTTLE_TIME) return;
    lastMoveAt = now;

    loopSystem.moveItem(loopSystem.index, index);
    loopSystem.index = index;
  };

  const handleClick = (index: number) => {
    loopSystem.index = index;
  };

  let editInputEl: HTMLInputElement | undefined = $state(undefined);
  let editIndex: number | undefined = $state(undefined);
  let editLabel: string = $state("");

  // ラベル名変更の入力開始時に自動フォーカス
  $effect(() => {
    if (editIndex !== undefined && editInputEl !== undefined) {
      editInputEl.focus();
      editInputEl.select();
    }
  });

  const handleLabelDblClick = (index: number, label: string) => {
    editIndex = index;
    editLabel = label;
  };

  const saveLabelInput = (index: number) => {
    if (editIndex !== undefined && editLabel.trim() !== "") {
      loopSystem.updateItem(index, { label: editLabel });
    }
    editIndex = undefined;
  };

  const handleLabelInputKeyDown = (event: KeyboardEvent, index: number) => {
    if (event.key === "Enter") saveLabelInput(index);
    else if (event.key === "Escape") {
      editIndex = undefined;
    }
  };

  const handleRemoveClick = (event: MouseEvent, index: number) => {
    event.stopPropagation();
    loopSystem.removeItemAt(index);
  };
</script>

<div 
  class="tw:w-full tw:flex tw:flex-col tw:gap-1 tw:pt-3 tw:pb-5"
  role="table"
>
  {#each loopSystem.items as item, index (item.id)}
    <!-- svelte-ignore a11y_click_events_have_key_events ←ごめん -->
    <div 
      class="tw:grid tw:grid-cols-[8rem_1fr] tw:rounded-sm tw:gap-0.5 tw:pointer-events-auto
             tw:shrink-0 tw:transition-[height] tw:duration-250 tw:relative
             {loopSystem.index === index ? "tw:bg-s400 tw:h-10" : "tw:bg-p600 tw:h-5"}" 
      role="row"
      draggable="true"
      ondragstart={e => {handleDragStart(e, index);}}
      ondragenter={() => {handleDragEnter(index);}}
      onclick={() => {handleClick(index);}}
      ondblclick={() => {handleLabelDblClick(index, item.label);}}
      tabindex="0"
      animate:flip={{ duration: 200 }}
    >
      <div
        class="tw:grid tw:justify-items-center tw:items-center tw:select-none tw:pointer-events-none
               tw:text-sm tw:px-1 tw:rounded-sm tw:h-full tw:min-h-0
               {loopSystem.index === index ? "tw:bg-s800" : "tw:bg-p700"}"
      >
        <p class="">{formatTime(item.from)} - {formatTime(item.to)}</p>
      </div>
      <div
        class="tw:grid tw:place-items-start tw:items-center tw:pl-3 tw:select-none tw:pointer-events-none
               tw:text-sm tw:px-1 tw:rounded-sm tw:h-full tw:min-h-0
               {loopSystem.index === index ? "tw:bg-s800" : "tw:bg-p700"}"
      >
        {#if editIndex === index}
          <input
            type="text"
            bind:value={editLabel}
            bind:this={editInputEl}
            onblur={() => {saveLabelInput(index);}}
            onkeydown={e => {handleLabelInputKeyDown(e, index);}}
          >
        {:else}
          <p class="">{item.label}</p>
        {/if}
      </div>
      {#if loopSystem.index === index}
        <button
          class="tw:h-5 tw:w-5 tw:rounded-md tw:bg-s900 tw:hover:bg-s950
                 tw:absolute tw:right-1 tw:top-1/2 tw:-translate-y-1/2
                 tw:grid tw:place-items-center"
          onclick={e => {handleRemoveClick(e, index);}}
        >
          <CloseIcon size={14} color="var(--tw-color-s300)"></CloseIcon>
        </button>
      {/if}
    </div>
  {/each}
</div>