import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { TasksGetResponse } from "@/app/api/tasks/get";
import type { TasksPatchRequest } from "@/app/api/tasks/patch";
import type { Task } from "@/src/db/schema/tasks";
import type { OperationError } from "../../errors";
import { queries } from "../../queries";
import type { OptimisticUpdateResult } from "../../types/app";
import type { EagerUpdaterResult } from "../../types/eagerUpdate";
import type { TaskApp } from "../../types/tasks";
import type { StandardizeResponse } from "../../utils/createResponse";
import { eagerUpdaterTaskDetail } from "../../utils/eagerUpdater/tasks/detail";
import {
  type EagerUpdateTasksProjectResult,
  eagerUpdaterTasksProject,
} from "../../utils/eagerUpdater/tasks/project";

export interface UseUpdateTaskDefaultContext {
  euTasksProject?: EagerUpdateTasksProjectResult;
  euSubtasksList?: EagerUpdaterResult<TaskApp>;

  // New Version
  ouTasksDetail?: OptimisticUpdateResult<TasksGetResponse>;
  ouTasksDetailSubtasks?: OptimisticUpdateResult<TasksGetResponse>;
  ouCompletedTasksDetailSubtasks?: OptimisticUpdateResult<TasksGetResponse>;
}

export interface UseUpdateTaskVariables {
  req: TasksPatchRequest;
  old: Task;
}

/**
 *
 * ALL TASK UPDATES MUST USE THIS HOOKS, NO EXCEPTIONS!
 *
 * A custom hook to update a task using React Query's `useMutation`, with support for eager updates,
 * rollback on error, and cache invalidation.
 *
 * @template TContext - The context returned from `onMutate`, extending `UseUpdateTaskDefaultContext`.
 *
 * @param {string[]} mutationKey - Unique key used by React Query to identify this mutation.
 * @param {Omit<UseMutationOptions<StandardizeResponse<Task>, OperationError, UseUpdateTaskVariables, TContext>, "mutationKey" | "mutationFn">} [options]
 * Optional mutation configuration options, excluding `mutationKey` and `mutationFn` which are handled internally.
 *
 * @returns {ReturnType<typeof useMutation>} - Returns the mutation object from `useMutation` containing:
 *  - `mutate` and `mutateAsync` methods to trigger the mutation.
 *  - Status booleans like `isLoading`, `isError`, etc.
 *  - Result data, error, and context values.
 *  - In other words? Anything from useMutation
 *
 * @example
 * ```tsx
 * const { mutate: updateTask } = useUpdateTask(["update-task"], {
 *   onSuccess: (data) => console.log("Updated!", data),
 * });
 *
 * updateTask({
 *   req: { id: "task-1", newValues: {name: "New Name"} },
 *   old: task,
 * });
 * ```
 *
 * @see {@link TasksPatchRequest} - this interface for usage.
 *
 *
 * @remarks
 * This hook handles the following internally:
 * - **Eager Update**: Applies a local update to the React Query cache before the server confirms the change.
 * - **Rollback**: Restores the old state if the mutation fails.
 * - **Cache Invalidation**: Invalidates queries to refetch fresh data after mutation completes.
 *
 * @see {@link eagerUpdaterTasksProject} - For example on how to do an optimistic update
 *
 * @throws {OperationError} If the mutation fails, the error is re-thrown for handling in `onError`.
 */
export const useUpdateTask = <TContext extends UseUpdateTaskDefaultContext>(
  mutationKey: string[],
  options?: Omit<
    UseMutationOptions<
      StandardizeResponse<Task>,
      OperationError,
      UseUpdateTaskVariables,
      // biome-ignore lint/suspicious/noConfusingVoidType: CHAINING, SO VOID IS FINE.
      TContext | void
    >,
    "mutationKey" | "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...options,

    // Hard-coded mutationKey and mutationFn
    mutationKey,
    mutationFn: async (data: UseUpdateTaskVariables) => {
      const { req } = data;
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });

      const result = await response.json();

      if (!response.ok) {
        throw result;
      }

      return result;
    },

    // Eager Update
    onMutate: (data, context) => {
      // Chain mutation context
      const extensions = options?.onMutate?.(data, context);

      // mandatory, don't delete!
      queryClient.cancelQueries({
        queryKey: ["tasks"],
        exact: false,
      });

      // Assume anything on the context is nullable!
      return {
        // Update Project tasks list eager update [deprecated]
        euTasksProject: eagerUpdaterTasksProject.update(
          data.req,
          data.old.projectId,
          queryClient,
        ),
        euSubtasksList: eagerUpdaterTaskDetail.updateSubtasksList(
          data.req,
          queryClient,
          data?.old?.parentTask,
        ),

        // Newer Version
        ouTasksDetail: queries.optimisticUpdates.tasks.detail.update(
          data.req,
          queryClient,
        ),
        ouTasksDetailSubtasks: data?.old?.parentTask
          ? queries.optimisticUpdates.tasks.lists.update(
              queries.tasks.detailSubtasks(data.old.parentTask).queryKey,
              data.req,
              queryClient,
            )
          : undefined,
        ouCompletedTasksDetailSubtasks: data?.old?.parentTask
          ? queries.optimisticUpdates.tasks.lists.update(
              queries.tasks.completedDetailSubtasks(data.old.parentTask || "")
                .queryKey,
              data.req,
              queryClient,
            )
          : undefined,

        // More eager update here...

        // Extensions
        ...(extensions ?? {}),
      } as TContext;
    },
    onError: (error, variables, onMutateResult, context) => {
      // Extending
      console.log(error);
      options?.onError?.(error, variables, onMutateResult, context);

      // Roll Backs
      if (onMutateResult?.euTasksProject) {
        queryClient.setQueryData(
          onMutateResult?.euTasksProject?.queryKey,
          onMutateResult?.euTasksProject?.oldData,
        );
      }

      if (onMutateResult?.euSubtasksList) {
        queryClient.setQueryData(
          onMutateResult?.euSubtasksList?.queryKey,
          onMutateResult?.euSubtasksList?.oldData,
        );
      }

      if (onMutateResult?.ouTasksDetail) {
        queryClient.setQueryData(
          onMutateResult?.ouTasksDetail?.queryKey,
          onMutateResult?.ouTasksDetail?.oldData,
        );
      }

      if (onMutateResult?.ouTasksDetailSubtasks) {
        queryClient.setQueryData(
          onMutateResult?.ouTasksDetailSubtasks?.queryKey,
          onMutateResult?.ouTasksDetailSubtasks?.oldData,
        );
      }

      if (onMutateResult?.ouCompletedTasksDetailSubtasks) {
        queryClient.setQueryData(
          onMutateResult?.ouCompletedTasksDetailSubtasks?.queryKey,
          onMutateResult?.ouCompletedTasksDetailSubtasks?.oldData,
        );
      }
    },
    onSuccess: (_data, _variables, _onMutateResult, _context) => {
      options?.onSuccess?.(_data, _variables, _onMutateResult, _context);
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      // Extending
      options?.onSettled?.(data, error, variables, onMutateResult, context);

      // Invalidations
      if (onMutateResult?.euTasksProject) {
        queryClient.invalidateQueries({
          queryKey: onMutateResult?.euTasksProject?.queryKey,
        });
      }

      if (onMutateResult?.euSubtasksList) {
        queryClient.invalidateQueries({
          queryKey: onMutateResult?.euSubtasksList?.queryKey,
        });
      }

      if (onMutateResult?.ouTasksDetail) {
        queryClient.invalidateQueries({
          queryKey: onMutateResult?.ouTasksDetail?.queryKey,
        });
      }

      if (onMutateResult?.ouTasksDetailSubtasks) {
        queryClient.invalidateQueries({
          queryKey: onMutateResult?.ouTasksDetailSubtasks?.queryKey,
        });
      }

      if (onMutateResult?.ouCompletedTasksDetailSubtasks) {
        queryClient.invalidateQueries({
          queryKey: onMutateResult?.ouCompletedTasksDetailSubtasks?.queryKey,
        });
      }
    },
  });

  return mutation;
};
