import type { QueryClient } from "@tanstack/react-query";
import type { TasksDeleteRequest } from "@/app/api/tasks/delete";
import type { TasksGetResponse } from "@/app/api/tasks/get";
import type { TasksPatchRequest } from "@/app/api/tasks/patch";
import type { OptimisticUpdateResult } from "../../types/app";
import type { TaskApp } from "../../types/tasks";
import { queries } from "..";

const append = (
  newTask: TaskApp,
  queryKey: string[],
  queryClient: QueryClient,
) => {
  if (newTask?.parentTask) {
    const oldData = queryClient.getQueryData(queryKey) as
      | TasksGetResponse
      | undefined;

    // Append
    if (oldData) {
      queryClient.setQueryData(queryKey, () => {
        if (!oldData?.result?.data) return oldData;
        const oldList = oldData?.result?.data?.filter(
          (item) => item?.id !== newTask?.id,
        );

        const newList = [newTask, ...oldList];

        return {
          ...oldData,
          result: {
            ...oldData?.result,
            data: newList,
          },
        };
      });
    }
  }
};

const update = (
  queryKey: string[],
  req: TasksPatchRequest,
  queryClient: QueryClient,
): OptimisticUpdateResult<TasksGetResponse> => {
  // 1. Get Old Data
  const oldData = queryClient.getQueryData(queryKey) as
    | TasksGetResponse
    | undefined;

  console.log("querykey", queryKey);
  console.log("oldData", oldData);

  // 2. Update Data
  const newData = ((): TasksGetResponse | undefined => {
    //  Validate oldData existence
    if (!oldData) return undefined;

    //  Extract oldTask
    const oldTask = oldData?.result?.data?.find((item) => item.id === req.id);

    //  Validate oldTask existence
    if (!oldTask) return undefined;

    //  Create new task
    const newTask = {
      ...oldTask,
      ...req.newValues,
    };

    // Create New List
    const newList = oldData?.result?.data?.map((item) =>
      item.id === req.id ? newTask : item,
    );

    //  Return new data
    return {
      ...oldData,
      result: {
        ...oldData?.result,
        data: newList,
      },
    };
  })();

  // 6. Update Data
  if (oldData && newData) {
    queryClient.setQueryData(queryKey, newData);

    // Get New Task
    const newTask = newData?.result?.data?.find((item) => item?.id === req?.id);

    // 7. Check if update type is completion toggle true
    if (req?.newValues?.completedAt) {
      // Append newTask to completed subtasks for task detail page
      if (newTask?.parentTask) {
        append(
          newTask,
          queries.tasks.completedDetailSubtasks(newTask?.parentTask)?.queryKey,
          queryClient,
        );
      }
    }

    // 8. Check if update type is completion toggle false
    if (req?.newValues?.completedAt === null) {
      // Append newTask to active subtasks for task detail page
      if (newTask?.parentTask) {
        append(
          newTask,
          queries.tasks.detailSubtasks(newTask?.parentTask)?.queryKey,
          queryClient,
        );
      }
    }
  }

  // Return
  return { oldData, queryKey, newData };
};

const del = (
  queryKey: string[],
  req: TasksDeleteRequest,
  queryClient: QueryClient,
): OptimisticUpdateResult<TasksGetResponse> => {
  // 1. Get Old Data
  const oldData = queryClient.getQueryData(queryKey) as
    | TasksGetResponse
    | undefined;

  // 2. Update New Data
  const newData = ((): TasksGetResponse | undefined => {
    // 1.  Validate oldData existence
    if (!oldData?.result?.data) return undefined;

    // 2. Extract old List
    const oldList = oldData?.result?.data;

    // 3. Validate oldList
    if (!oldList || !Array.isArray(oldList)) return undefined;

    // 4. Create new list
    const newList = oldList.filter((item) => item.id !== req.id);

    // 5. Return New Data
    return {
      ...oldData,
      result: {
        ...oldData?.result,
        data: newList,
      },
    };
  })();

  if (oldData && newData) {
    queryClient.setQueryData(queryKey, newData);
  }

  return { oldData, newData, queryKey };
};

const tasksList = {
  update,
  del,
  append,
};

export default tasksList;
