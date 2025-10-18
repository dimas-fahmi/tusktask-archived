import { tasksDetail } from "./tasksDetail";
import tasksList from "./tasksList";

export const optimisticUpdates = {
  tasks: {
    detail: tasksDetail,
    lists: tasksList,
  },
};
