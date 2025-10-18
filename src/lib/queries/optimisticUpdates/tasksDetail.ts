import type { QueryClient } from "@tanstack/react-query";
import type { TasksGetResponse } from "@/app/api/tasks/get";
import type { TasksPatchRequest } from "@/app/api/tasks/patch";
import type { Task } from "@/src/db/schema/tasks";
import type { OptimisticUpdateResult } from "../../types/app";
import { queries } from "..";

export const update = (
  request: TasksPatchRequest,
  queryClient: QueryClient,
): OptimisticUpdateResult<TasksGetResponse> => {
  // 1. QueryKey
  const queryKey = queries.tasks.detail(request.id).queryKey;

  // 2. Get Old Data
  const oldData = queryClient.getQueryData(queryKey) as
    | TasksGetResponse
    | undefined;

  // 3. Create New Data
  const newData = ((): TasksGetResponse | undefined => {
    // 1. Validate oldData exist
    if (!oldData) return;

    // 2. Get Task
    const oldTask = oldData?.result?.data?.[0];

    // 3. Validate oldTask exist
    if (!oldTask) return;

    // 4. Create New Task
    const newTask: Task = {
      ...oldTask,
      ...request?.newValues,
    };

    // 5. Update Document Title
    if (document) {
      document.title = `${request?.newValues?.name || oldTask?.name} | TuskTask`;
    }

    // 6. return new data
    return {
      ...oldData,
      result: {
        ...oldData?.result,
        data: [newTask],
      },
    };
  })();

  //  4. Update cache if oldData exist
  if (oldData && newData) {
    queryClient.setQueryData(queryKey, newData);
  }

  // 5. Result
  return {
    queryKey,
    newData,
    oldData,
  };
};

export const tasksDetail = {
  update,
};
