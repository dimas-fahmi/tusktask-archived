import type { PriorityLevel, SituationKey, TaskApp } from "../types/tasks";
import type { CategorizedTasks } from "./categorizedTasks";

/**
 * Filters the pre-categorized tasks based on an optional situation key and an optional priority level.
 *
 * @param categorizedTasks The object containing all categorized task arrays.
 * @param situationKey Optional key of the primary task category (e.g., 'overdue', 'tomorrow').
 * @param priorityLevel Optional priority level to filter by ('low', 'medium', 'high', 'urgent').
 * @returns An array of TaskApp objects matching the criteria.
 */
export const filterCategorizedTasks = (
  categorizedTasks: CategorizedTasks,
  situationKey?: SituationKey,
  priorityLevel?: PriorityLevel,
): TaskApp[] => {
  if (priorityLevel === "all") {
    priorityLevel = undefined;
  }

  if (situationKey === "all") {
    situationKey = undefined;
  }

  // --- 1. Determine the base list of tasks (Situation Filter) ---
  let baseTasks: TaskApp[] = [];

  if (situationKey && categorizedTasks[situationKey]) {
    // If a specific situation key is provided, use that list directly.
    // We cast situationKey to a valid key for array access.
    baseTasks = categorizedTasks[situationKey] as TaskApp[];
  } else {
    // If no specific situation is provided, we return ALL tasks.
    // We combine the main status buckets (todos, archived, completed) and deduplicate them.
    // Using 'todos', 'archived', and 'completed' should cover all tasks without priority duplication.
    const allTasks = [
      ...categorizedTasks.todos,
      ...categorizedTasks.archived,
      ...categorizedTasks.completed,
    ];

    // Deduplicate the list using a Map for efficient ID checking
    const taskMap = new Map<string, TaskApp>();
    for (const task of allTasks) {
      if (task.id) {
        taskMap.set(task.id, task);
      }
    }
    baseTasks = Array.from(taskMap.values());

    // Log the "Show All" action
    console.log(
      "No situation provided. Showing all unique active, archived, and completed tasks.",
    );
  }

  // --- 2. Filter the base list by Priority ---
  if (priorityLevel) {
    // Filter the base list to only include tasks matching the required priority
    return baseTasks.filter((task) => task.taskPriority === priorityLevel);
  }

  // --- 3. Return the results ---
  // If no priority filter, return the base list
  return baseTasks;
};

/**
 * Generates a descriptive string for the current task filter settings.
 *
 * @param situationKey Optional key of the primary task category (e.g., 'overdue', 'tomorrow').
 * @param priorityLevel Optional priority level (e.g., 'high', 'low').
 * @returns A descriptive string like "Filtering overdue tasks with high priority."
 */
export const getFilteredCTsDescription = (
  situationKey?: SituationKey | string,
  priorityLevel?: PriorityLevel | string,
): string => {
  if (priorityLevel === "all") {
    priorityLevel = undefined;
  }

  if (situationKey === "all") {
    situationKey = undefined;
  }

  if (situationKey === "overdueSoon") {
    situationKey = "Overdue Soon";
  }

  if (!situationKey && !priorityLevel) {
    // Case 1: No filters applied
    return "Showing all active tasks";
  }

  let description = "Showing ";

  if (situationKey && priorityLevel) {
    // Case 2: Both filters applied
    // e.g., "Filtering overdue tasks with high priority"
    description += `active ${situationKey} tasks with ${priorityLevel} priority`;
  } else if (situationKey) {
    // Case 3: Only situation applied
    // e.g., "Filtering archived tasks"
    description += `active ${situationKey} tasks`;
  } else if (priorityLevel) {
    // Case 4: Only priority applied
    // e.g., "Filtering tasks with urgent priority"

    description += `active tasks with ${priorityLevel} priority`;
  }

  // Capitalize the first letter of the sentence for better readability
  return description.charAt(0).toUpperCase() + description.slice(1);
};
