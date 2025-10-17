import type { TaskCategory } from "./categorizedTasks";

/**
 *
 * Helper function to construct a URL directing to task page list
 *
 * @param context Either show tasks belong to a parent task or project `task` or `project`
 * @param category Category, union based on categorizedTasks key
 * @param id uuid of context, either a parent task id or project id
 * @returns string, a URL directing to task list page
 */
export const constructTPLU = (
  context: "task" | "project",
  category: TaskCategory,
  id: string,
) => {
  return `/dashboard/tasks/list/${context}/${category}/${id}`;
};
