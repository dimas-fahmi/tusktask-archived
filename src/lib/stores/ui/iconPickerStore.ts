import { create } from "zustand";

export interface IconPickerStore {
  pickedIcon: string;
  setPickedIcon: (n: string) => void;

  iconPickerDrawerOpen: boolean;
  setIconPickerDrawerOpen: (n: boolean) => void;
}

export const useIconPickerStore = create<IconPickerStore>((set) => ({
  pickedIcon: "Clock1",
  setPickedIcon: (n) => set({ pickedIcon: n }),

  iconPickerDrawerOpen: false,
  setIconPickerDrawerOpen: (n) => set({ iconPickerDrawerOpen: n }),
}));
