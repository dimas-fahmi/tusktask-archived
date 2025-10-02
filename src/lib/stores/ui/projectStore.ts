import { File, LucideIcon } from "lucide-react";
import { create } from "zustand";

export type ProjectStoreSetter = Omit<
  ProjectStore,
  "setNewProjectDrawerOpen" | "setNewProjectIcon"
>;

export interface ProjectStore {
  // New Project Drawer States
  newProjectDrawerOpen: boolean;
  setNewProjectDrawerOpen: (n: boolean) => void;
  newProjectIcon: LucideIcon;
  setNewProjectIcon: (n: LucideIcon) => void;

  // Setter
  setter: (n: ProjectStoreSetter) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  newProjectDrawerOpen: false,
  setNewProjectDrawerOpen: (n) => set({ newProjectDrawerOpen: n }),
  newProjectIcon: File,
  setNewProjectIcon: (n) => set({ newProjectIcon: n }),

  // Setter
  setter: (n) => set({ ...n }),
}));
