import type { TasksGetRequest } from "@/app/api/tasks/get";
import { optimisticUpdates } from "./optimisticUpdates";

export interface QueryContext<TRequest> {
  request: TRequest;
}

export interface AppQuery<TRequest> {
  queryKey: string[];
  queryFn?: unknown;
  context?: QueryContext<TRequest>;
}

export const queries = {
  tasks: {
    detail: (
      taskId: string,
      limit?: number,
      offset?: number,
    ): AppQuery<TasksGetRequest> => {
      const request: TasksGetRequest = {
        id: taskId,
        include: "parent,project,masterTask",
        limit,
        offset,
      };

      return {
        queryKey: ["tasks", "detail", taskId],
        context: {
          request,
        },
      };
    },
    detailSubtasks: (
      taskId: string,
      limit?: number,
      offset?: number,
    ): AppQuery<TasksGetRequest> => {
      const request: TasksGetRequest = {
        parentTask: taskId,
        limit,
        offset,
      };

      return {
        queryKey: ["tasks", "detail", "subtasks", taskId],
        context: {
          request,
        },
      };
    },
  },
  optimisticUpdates,
};
