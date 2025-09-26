import { create } from "zustand";

export interface PublicSidebarStore {
  open: boolean;
  setOpen: (n: boolean) => void;
  toggleOpen: () => void;
}

export const usePublicSidebarStore = create<PublicSidebarStore>((set) => ({
  open: false,
  setOpen: (n) => set({ open: n }),
  toggleOpen: () => set((s) => ({ open: !s.open })),
}));
