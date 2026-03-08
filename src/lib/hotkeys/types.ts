export type HotkeyItem = {
  function: string;
  default: string;
};

export type HotkeyGroup = {
  group: string;
  children: (HotkeyItem | HotkeyGroup)[];
};

export type HotkeyDef = HotkeyItem | HotkeyGroup;

export type UserKeyConfig = Record<string, string>;