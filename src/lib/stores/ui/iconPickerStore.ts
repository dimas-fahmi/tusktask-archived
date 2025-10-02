import { create } from "zustand";

export interface IconPickerStore {
  iconPickerDrawerOpen: boolean;
  setIconPickerDrawerOpen: (n: boolean) => void;
}

export const useIconPickerStore = create<IconPickerStore>((set) => ({
  iconPickerDrawerOpen: false,
  setIconPickerDrawerOpen: (n) => set({ iconPickerDrawerOpen: n }),
}));
