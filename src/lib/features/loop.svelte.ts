export type LoopItem = {
  id: string;
  from: number;
  to: number;
  label: string;
};

export const createLoopSystem = () => {
  let seekHandlers: ((time: number) => void)[] = [];
  let getTime: (() => number) | undefined;
  let items: LoopItem[] = $state([]);
  let currentIndex: number | undefined = $state(undefined);
  let isEnabled = $state(false);
  let currentItem = $derived(
    currentIndex === undefined
    ? { id: undefined, from: undefined, to: undefined, label: undefined }
    : items[currentIndex]);
  
  const isValidIndex = (index: number | undefined) => {
    return typeof index === "number" && 0 <= index && index < items.length;
  }

  const trySeek = () => {
    if (currentIndex === undefined) return;
    if (getTime === undefined) return;
    const time = getTime();
    const loopItem = items[currentIndex];

    const MARGIN = 0.1;
    const isOutOfRange = time < (loopItem.from - MARGIN) || (loopItem.to + MARGIN) < time;
    if (isOutOfRange) {
      seekHandlers.forEach(f => { f(loopItem.from); });
    }
  };

  const validateItem = (item: LoopItem) => {
    if (item.to < item.from) {
      let tmp = item.from;
      item.from = item.to;
      item.to = tmp;
    }
    if (item.label.trim() === "") item.label = "新規ループアイテム";
  }

  const setIndex = (index: number | undefined) => {
    if (isValidIndex(index)) currentIndex = index;
    else currentIndex = undefined;
  };

  const addItem = (item: {from: number, to: number, label: string}) => {
    const itemWithId = {...item, id: crypto.randomUUID()};
    validateItem(itemWithId);
    items.push(itemWithId);
  };
  
  const removeItemAt = (index: number) => {
    if (!isValidIndex(index)) return;
    items.splice(index, 1);
    // 最後の要素だったら1個前に戻る or undefined
    if (typeof currentIndex === "number" && !isValidIndex(currentIndex)) {
      setIndex(currentIndex - 1);
    }
  };

  const moveItem = (index: number, moveTo: number) => {
    if (!isValidIndex(index)) return;
    if (index == moveTo) return;
    const item = items[index];
    items.splice(index, 1);
    items.splice(moveTo, 0, item);
  }

  const updateItem = (index: number, item: {from?: number, to?: number, label?: string}) => {
    if (!isValidIndex(index)) return;
    items[index] = { ...items[index], ...item };
    validateItem(items[index]);
  };

  const setTimeProvider = (callback: typeof getTime) => {
    getTime = callback;
  }

  // observing: isEnabled
  $effect(() => {
    if (!isEnabled) return;
    const intervalId = setInterval(trySeek, 100);
    return () => {
      clearInterval(intervalId);
    };
  });

  return {
    enable: () => { isEnabled = true; },
    disable: () => { isEnabled = false; },
    addItem,
    removeItemAt,
    moveItem,
    updateItem,
    setTimeProvider,
    set seekHandlers(v: typeof seekHandlers) { seekHandlers = v; },
    get seekHandlers() { return seekHandlers; },
    set index(v: number | undefined) { setIndex(v); },
    get index() { return currentIndex; },
    get items(): readonly Readonly<LoopItem>[] { return items; },
    get enabled() { return isEnabled; },
    set enabled(v: boolean) { isEnabled = v; },
    get current() { return currentItem; }
  }
};

export type LoopSystem = ReturnType<typeof createLoopSystem>;