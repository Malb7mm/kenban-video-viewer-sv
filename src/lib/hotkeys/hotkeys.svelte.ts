export const createHotkeySystem = () => {
  let triggerKey = $state("ControlLeft");
  let isControlMode = $state(false);
  let functionMap = $state<Record<string, () => void>>({});

  // MicrosoftIMEに謎のバグがあるっぽい
  const getCode = (e: KeyboardEvent) => {
    let code = e.code;
    if (e.key === "Shift" && e.code === "") code = "ShiftRight";
    return code;
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    let code = getCode(e);

    if (code === triggerKey) {
      e.preventDefault();
      isControlMode = true;
      return;
    }
    if (isControlMode && functionMap[code] !== undefined) {
      e.preventDefault();
      if (!e.repeat) functionMap[code]();
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    let code = getCode(e);

    if (code === triggerKey) {
      isControlMode = false;
    }
  };

  const init = () => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
  }

  const destroy = () => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
  }

  return {
    get isControlMode() { return isControlMode; },
    get triggerKey() { return triggerKey; },
    set triggerKey(v: string) { triggerKey = v; },
    get functionMap() { return functionMap; },
    set functionMap(v: Record<string, () => void>) { functionMap = v; },
    init,
    destroy,
  }
};