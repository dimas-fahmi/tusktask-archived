import { Project } from "@/src/db/schema/projects";
import { create } from "zustand";
import { TaskApp } from "../../types/tasks";
import { Task } from "@/src/db/schema/tasks";

/**
 * Zustand store for managing task-related UI and state.
 */
export interface TaskStore {
  /**
   * Indicates if the "New Task" dialog is open.
   */
  newTaskDialogOpen: boolean;

  /**
   * Sets the state of the "New Task" dialog.
   * @param open - Boolean value to open or close the dialog.
   *
   * Needs to manually set active project and parent task, unreliable. Prefer openNewTaskDialog, use this only for root task creation where parent task is not provided. (Project is not automatically set, user have to use the select component)
   *
   */
  setNewTaskDialogOpen: (n: boolean) => void;

  /**
   * Indicates if the "Reschedule Task" dialog is open.
   */
  rescheduleDialogOpen: boolean;

  /**
   * Sets the state of the "Reschedule Task" dialog.
   * @param n - Boolean value to open or close the dialog.
   *
   * Need to manually setup the active task before executing this function, unreliable. Only use this to close the reschedule dialog.
   *
   * @example
   * ```ts
   * setActiveTask(task);
   * setRescheduleDialogOpen(true);
   * ```
   *
   * Prefer openRescheduleDialog
   *
   */
  setRescheduleDialogOpen: (n: boolean) => void;

  /**
   *
   * Encourage to use this for opening reschedule dialog, reliably set the required active task.
   *
   * @param task Required
   * @returns
   */
  openRescheduleDialog: (task: Task) => void;

  /**
   * Currently active task in the UI.
   *
   * Used for task updates to avoid confusion and conflict with parent task
   *
   */
  activeTask?: TaskApp;

  /**
   * Sets the currently active task.
   * @param n - The task to be set as active.
   */
  setActiveTask: (n: TaskApp) => void;

  /**
   * Currently active project associated with a task.
   */
  activeProject?: Project;

  /**
   * Sets the active project.
   * @param n - The project to be set as active, or undefined to clear.
   */
  setActiveProject: (n?: Project) => void;

  /**
   * The parent task, used when creating a subtask.
   *
   * used for subtask creation, to avoid confusion and conflict with active tasks.
   *
   */
  parentTask: Task | null;

  /**
   * Sets the parent task.
   * @param n - The parent task to be set, or null to clear.
   */
  setParentTask: (n: Task | null) => void;

  /**
   *
   * Encourage to use this, instead of setNewTaskDialogOpen for opening new task dialog.
   *
   * Opens the "New Task" dialog with optional parent task context.
   * Also sets the active project and parent task accordingly.
   * @param project - The project to associate with the new task.
   * @param parentTask - Optional parent task if creating a subtask.
   */
  openNewTaskDialog: (project: Project, parentTask?: Task) => void;

  /**
   * Hard resets the task store state to its default values.
   */
  reset: () => void;
}

/**
 * Default values for the task store state.
 */
export const taskStoreDefaultValues = {
  newTaskDialogOpen: false,
  activeProject: undefined,
  rescheduleDialogOpen: false,
  activeTask: undefined,
  parentTask: null,
};

/**
 * Zustand store implementation for task-related state management.
 */
export const useTaskStore = create<TaskStore>((set) => ({
  ...taskStoreDefaultValues,

  // Setters
  setNewTaskDialogOpen: (n) => set({ newTaskDialogOpen: n }),
  setActiveProject: (n) => set({ activeProject: n }),
  setRescheduleDialogOpen: (n) => set({ rescheduleDialogOpen: n }),
  setActiveTask: (n) => set({ activeTask: n }),
  setParentTask: (n) => set({ parentTask: n }),

  // Open Reschedule dialog
  openRescheduleDialog: (t) =>
    set({ rescheduleDialogOpen: true, activeTask: t }),

  // Opens the new task dialog with relevant context
  openNewTaskDialog: (project, parentTask) =>
    set({
      newTaskDialogOpen: true,
      activeProject: project,
      parentTask: parentTask,
    }),

  // Reset to defaults
  reset: () => set(taskStoreDefaultValues),
}));
