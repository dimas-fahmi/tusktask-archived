import { Project } from "@/src/db/schema/projects";
import { create } from "zustand";

export interface TaskStore {
  // New Task Dialog State
  newTaskDialogOpen: boolean;
  setNewTaskDialogOpen: (n: boolean) => void;

  // Active Project State
  activeProject?: Project;
  setActiveProject: (n?: Project) => void;

  // Resetter
  reset: () => void;
}

export const taskStoreDefaultValues = {
  newTaskDialogOpen: false,
  activeProject: undefined,
};

export const useTaskStore = create<TaskStore>((set) => ({
  ...taskStoreDefaultValues,

  // Setters
  setNewTaskDialogOpen: (n) => set({ newTaskDialogOpen: n }),
  setActiveProject: (n) => set({ activeProject: n }),

  // Resetter
  reset: () => set(taskStoreDefaultValues),
}));
