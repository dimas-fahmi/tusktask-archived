import { Task } from "@/src/db/schema/tasks";

export interface CategorizedTasks {
  overdue: Task[];
  overdueSoon: Task[];
  tomorrow: Task[];
  ongoing: Task[];
  archived: Task[];
  completed: Task[];
}

export const categorizeTasks = (tasks?: Task[]): CategorizedTasks => {
  const categorizedTasks: CategorizedTasks = {
    archived: [],
    completed: [],
    overdue: [],
    overdueSoon: [],
    tomorrow: [],
    ongoing: [],
  };

  if (!tasks || !Array.isArray(tasks) || !tasks.length) {
    return categorizedTasks;
  }

  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const tomorrowDate = new Date(today);
  tomorrowDate.setDate(today.getDate() + 1);

  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  // Overdue
  categorizedTasks.overdue = tasks.filter((item) => {
    if (!item?.deadlineAt) return false;
    const deadlineAt = new Date(item.deadlineAt);
    return deadlineAt.getTime() < now.getTime();
  });

  // Overdue Soon (within the next 24 hours, not overdue)
  categorizedTasks.overdueSoon = tasks.filter((item) => {
    if (!item?.deadlineAt) return false;
    const deadlineAt = new Date(item.deadlineAt);
    const diff = deadlineAt.getTime() - now.getTime();
    const day = 1000 * 60 * 60 * 24;
    return diff > 0 && diff < day;
  });

  // Archived
  categorizedTasks.archived = tasks.filter(
    (item) => item.taskStatus === "archived"
  );

  // Completed
  categorizedTasks.completed = tasks.filter(
    (item) => item.taskStatus === "completed"
  );

  // Tomorrow (Deadline falls on tomorrow's date)
  categorizedTasks.tomorrow = tasks.filter((item) => {
    if (!item?.deadlineAt) return false;
    const deadlineAt = new Date(item.deadlineAt);
    return deadlineAt >= tomorrowDate && deadlineAt < dayAfterTomorrow;
  });

  // Ongoing (Not completed, not archived, not overdue, not overdueSoon, not tomorrow)
  categorizedTasks.ongoing = tasks.filter((item) => {
    const id = item.id;

    const isInOtherCategory =
      categorizedTasks.completed.find((t) => t.id === id) ||
      categorizedTasks.archived.find((t) => t.id === id) ||
      categorizedTasks.overdue.find((t) => t.id === id) ||
      categorizedTasks.overdueSoon.find((t) => t.id === id) ||
      categorizedTasks.tomorrow.find((t) => t.id === id);

    return !isInOtherCategory;
  });

  return categorizedTasks;
};
