import type { TasksGetRequest } from "@/app/api/tasks/get";
import {
  categoriesRequest,
  type TaskCategory,
} from "../utils/categorizedTasks";
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
    completedDetailSubtasks: (
      taskId: string,
      limit?: number,
      offset?: number,
    ): AppQuery<TasksGetRequest> => {
      const request: TasksGetRequest = {
        parentTask: taskId,
        isCompleted: "true",
        limit,
        offset,
        orderBy: "completedAt",
        orderDirection: "desc",
      };

      return {
        queryKey: ["tasks", "detail", "subtasks", "completed", taskId],
        context: { request },
      };
    },
    categoryList: (
      category: TaskCategory,
      context: "task" | "project",
      id: string,
    ): AppQuery<TasksGetRequest> => {
      return {
        queryKey: ["tasks", "list", category, context, id],
        context: {
          request: categoriesRequest[category],
        },
      };
    },
  },
  optimisticUpdates,
};
