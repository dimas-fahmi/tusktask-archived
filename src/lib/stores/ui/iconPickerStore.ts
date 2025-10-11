import { create } from "zustand";
import { DEFAULT_ICON } from "../../configs";

export interface IconPickerStore {
  pickedIcon: string;
  setPickedIcon: (n: string) => void;

  iconPickerDrawerOpen: boolean;
  setIconPickerDrawerOpen: (n: boolean) => void;
}

export const useIconPickerStore = create<IconPickerStore>((set) => ({
  pickedIcon: DEFAULT_ICON,
  setPickedIcon: (n) => set({ pickedIcon: n }),

  iconPickerDrawerOpen: false,
  setIconPickerDrawerOpen: (n) => set({ iconPickerDrawerOpen: n }),
}));
