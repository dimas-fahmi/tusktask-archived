import type { TaskApp } from "../types/tasks";

export type SortTaskValidField = keyof Pick<
  TaskApp,
  "completedAt" | "createdAt" | "deadlineAt" | "reminderAt"
>;

export const SORT_TASK_VALID_FIELD: SortTaskValidField[] = [
  "completedAt",
  "createdAt",
  "deadlineAt",
  "reminderAt",
];

export interface SortTaskInput {
  tasks: TaskApp[];
  sortBy?: SortTaskValidField;
  sortDirection?: "asc" | "desc";
}

export const sortTask = ({
  tasks,
  sortBy,
  sortDirection,
}: SortTaskInput): TaskApp[] => {
  return [...tasks].sort((a, b) => {
    if (sortBy) {
      if (!SORT_TASK_VALID_FIELD.includes(sortBy)) {
        throw new Error("Invalid sort field value");
      }
    }

    const field = sortBy ?? "createdAt";

    const aValue = a?.[field];
    const bValue = b?.[field];

    const aDate = aValue ? new Date(aValue) : undefined;
    const bDate = bValue ? new Date(bValue) : undefined;

    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;

    const diff = aDate.getTime() - bDate.getTime();

    return sortDirection === "desc" ? -diff : diff;
  });
};
