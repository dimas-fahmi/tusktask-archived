import type { TasksGetRequest } from "@/app/api/tasks/get";
import type { TaskApp } from "../types/tasks";

export interface CategorizedTasks {
  /**
   * Tasks that have exceeded their deadline date
   */
  overdue: TaskApp[];

  /**
   * Tasks overdue within 12 hours
   */
  overdueSoon: TaskApp[];

  /**
   * Tasks overdue within the next 24 hours
   */
  tomorrow: TaskApp[];

  /**
   *
   * @deprecated
   * DO NOT USE THIS, WILL BE DELETED SOON!
   *
   * Confusing - Prefer todos instead
   *
   * Ongoing (Not completed, not archived, not overdue, not overdueSoon, not tomorrow)
   *
   *
   */
  ongoing: TaskApp[];

  /**
   * All active tasks (not completed and not archived)
   */
  todos: TaskApp[];

  /**
   * Archived tasks
   */
  archived: TaskApp[];

  /**
   * Completed tasks, not determined by status only by completedAt either null (not completed) or exist (completed)
   */
  completed: TaskApp[];

  /**
   * Tasks without deadlines
   */
  noDeadlines: TaskApp[];

  /**
   * Tasks
   */
  onProcess: TaskApp[];

  // Priorities
  lowPriority: TaskApp[];
  mediumPriority: TaskApp[];
  highPriority: TaskApp[];
  urgentPriority: TaskApp[];
}

export interface CategorizeTasksOptions {
  hideSubtasks?: boolean;
}

export type TaskCategory = keyof CategorizedTasks;

export const categorizedTasksInformation: Record<
  keyof CategorizedTasks,
  { short: string; long: string; description: string }
> = {
  archived: {
    short: "Archived",
    long: "Archived Tasks",
    description: "Tasks that have been archived and are no longer active.",
  },
  completed: {
    short: "Completed",
    long: "Completed Tasks",
    description: "Tasks that have been marked as completed.",
  },
  overdue: {
    short: "Overdue",
    long: "Overdue Tasks",
    description: "Tasks with deadlines that have already passed.",
  },
  overdueSoon: {
    short: "Due Soon",
    long: "Tasks Due in 12 Hours",
    description: "Tasks that are due within the next 12 hours.",
  },
  tomorrow: {
    short: "Due Tomorrow",
    long: "Tasks Due in 24 Hours",
    description: "Tasks that are due within the next 24 hours.",
  },
  noDeadlines: {
    short: "No Deadlines",
    long: "Tasks Without Deadlines",
    description: "Tasks that do not have a set deadline.",
  },
  ongoing: {
    short: "Ongoing",
    long: "Ongoing Tasks (Deprecated)",
    description:
      "Deprecated: Tasks that are active but do not fit into other categories. Avoid using this.",
  },
  todos: {
    short: "Todos",
    long: "Active Tasks",
    description: "All active tasks that are not completed or archived.",
  },
  onProcess: {
    short: "In Progress",
    long: "Tasks In Progress",
    description: "Tasks currently being worked on.",
  },
  lowPriority: {
    short: "Low",
    long: "Low Priority Tasks",
    description: "Tasks marked with low priority.",
  },
  mediumPriority: {
    short: "Medium",
    long: "Medium Priority Tasks",
    description: "Tasks marked with medium priority.",
  },
  highPriority: {
    short: "High",
    long: "High Priority Tasks",
    description: "Tasks marked with high priority.",
  },
  urgentPriority: {
    short: "Urgent",
    long: "Urgent Priority Tasks",
    description: "Tasks marked as urgent and need immediate attention.",
  },
};

export const categoriesRequest: Record<
  keyof CategorizedTasks,
  TasksGetRequest
> = {
  overdue: {
    isOverdue: "true",
  },
  overdueSoon: {
    isSoon: 1000 * 60 * 60 * 12, // 12 hour
  },
  archived: {
    taskStatus: "archived",
  },
  completed: {
    isCompleted: "true",
  },
  noDeadlines: {
    isNoDeadline: "true",
  },
  ongoing: {},
  onProcess: {
    taskStatus: "on_process",
  },
  todos: {
    taskStatus: "pending",
  },
  tomorrow: {
    isTomorrow: "true",
  },

  // Priorities
  lowPriority: {
    taskPriority: "low",
  },
  mediumPriority: {
    taskPriority: "medium",
  },
  highPriority: {
    taskPriority: "high",
  },
  urgentPriority: {
    taskPriority: "urgent",
  },
};

export const categorizeTasks = (
  tasks?: TaskApp[],
  options?: CategorizeTasksOptions,
): CategorizedTasks => {
  const categorizedTasks: CategorizedTasks = {
    archived: [],
    completed: [],
    overdue: [],
    overdueSoon: [],
    tomorrow: [],
    ongoing: [],
    lowPriority: [],
    mediumPriority: [],
    highPriority: [],
    urgentPriority: [],
    todos: [],
    noDeadlines: [],
    onProcess: [],
  };

  if (!tasks || !Array.isArray(tasks) || !tasks.length) {
    return categorizedTasks;
  }

  // Filter out subtasks if needed
  const filteredTasks = options?.hideSubtasks
    ? tasks.filter((task) => !task.parentTask)
    : tasks;

  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const tomorrowDate = new Date(today);
  tomorrowDate.setDate(today.getDate() + 1);

  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  // Overdue
  categorizedTasks.overdue = filteredTasks.filter((item) => {
    if (
      !item?.deadlineAt ||
      ["completed", "archived"].includes(item?.taskStatus) ||
      item?.completedAt
    ) {
      return false;
    }
    const deadlineAt = new Date(item.deadlineAt);
    return deadlineAt.getTime() < now.getTime();
  });

  // Overdue Soon (within the next 23 hours, not overdue)
  categorizedTasks.overdueSoon = filteredTasks.filter((item) => {
    if (
      !item?.deadlineAt ||
      ["completed", "archived"].includes(item?.taskStatus) ||
      item?.completedAt
    ) {
      return false;
    }

    const deadlineAt = new Date(item.deadlineAt);
    const diff = deadlineAt.getTime() - now.getTime();
    const day = 1000 * 60 * 60 * 12; // replace to within 12 hours
    return diff > 0 && diff < day;
  });

  // Archived
  categorizedTasks.archived = filteredTasks.filter(
    (item) => item.taskStatus === "archived" && !item?.completedAt,
  );

  // Completed
  categorizedTasks.completed = filteredTasks.filter((item) => item.completedAt);

  // Tomorrow (Deadline falls on tomorrow's date)
  categorizedTasks.tomorrow = filteredTasks.filter((item) => {
    if (
      !item?.deadlineAt ||
      ["completed", "archived"].includes(item?.taskStatus) ||
      item?.completedAt
    ) {
      return false;
    }

    const isInSoon = categorizedTasks.overdueSoon.find((t) => t.id === item.id);

    const deadlineAt = new Date(item.deadlineAt);
    return (
      deadlineAt >= tomorrowDate && deadlineAt < dayAfterTomorrow && !isInSoon
    );
  });

  // Ongoing (Not completed, not archived, not overdue, not overdueSoon, not tomorrow)
  categorizedTasks.ongoing = filteredTasks.filter((item) => {
    const id = item.id;

    const isInOtherCategory =
      categorizedTasks.completed.find((t) => t.id === id) ||
      categorizedTasks.archived.find((t) => t.id === id) ||
      categorizedTasks.overdue.find((t) => t.id === id) ||
      categorizedTasks.overdueSoon.find((t) => t.id === id) ||
      categorizedTasks.tomorrow.find((t) => t.id === id);

    return !isInOtherCategory;
  });

  categorizedTasks.todos = filteredTasks?.filter((item) => {
    return (
      !item?.completedAt &&
      item?.taskStatus !== "archived" &&
      item?.taskStatus !== "on_process"
    );
  });

  categorizedTasks.onProcess = filteredTasks?.filter(
    (item) => item?.taskStatus === "on_process" && !item?.completedAt,
  );

  categorizedTasks.noDeadlines = filteredTasks?.filter(
    (item) => !item?.completedAt && !item?.deadlineAt,
  );

  // Priority
  categorizedTasks.lowPriority = filteredTasks.filter(
    (item) => item.taskPriority === "low",
  );
  categorizedTasks.mediumPriority = filteredTasks.filter(
    (item) => item.taskPriority === "medium",
  );
  categorizedTasks.highPriority = filteredTasks.filter(
    (item) => item.taskPriority === "high",
  );
  categorizedTasks.urgentPriority = filteredTasks.filter(
    (item) => item.taskPriority === "urgent",
  );

  return categorizedTasks;
};

export const categories = Object.keys(categorizedTasksInformation);
