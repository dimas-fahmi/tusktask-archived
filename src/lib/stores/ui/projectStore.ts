import { create } from "zustand";
import { DEFAULT_ICON } from "../../configs";

export type ProjectStoreSetter = Omit<
  ProjectStore,
  "setNewProjectDrawerOpen" | "setNewProjectIcon"
>;

export interface ProjectStore {
  // New Project Drawer States
  newProjectDrawerOpen: boolean;
  setNewProjectDrawerOpen: (n: boolean) => void;
  newProjectIcon: string;
  setNewProjectIcon: (n: string) => void;

  // Setter
  setter: (n: ProjectStoreSetter) => void;

  // Resetter
  reset: () => void;
}

export const DEFAULT_PROJECT_STORE = {
  newProjectDrawerOpen: false,
  newProjectIcon: DEFAULT_ICON,
};

export const useProjectStore = create<ProjectStore>((set) => ({
  ...DEFAULT_PROJECT_STORE,

  // Setter
  setter: (n) => set({ ...n }),
  setNewProjectDrawerOpen: (n) => set({ newProjectDrawerOpen: n }),
  setNewProjectIcon: (n) => set({ newProjectIcon: n }),

  // Reset
  reset: () => set(DEFAULT_PROJECT_STORE),
}));
