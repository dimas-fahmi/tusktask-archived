import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "../../queries";
import { eagerUpdaterTaskDetail } from "../../utils/eagerUpdater/tasks/detail";
import { eagerUpdaterTasksProject } from "../../utils/eagerUpdater/tasks/project";

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (req: {
      id: string;
      projectId: string;
      parentTaskId?: string | null;
    }) => {
      const { id } = req;
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw result;
      }

      return result;
    },
    onMutate: (data) => {
      return {
        tasksProject: eagerUpdaterTasksProject.del(
          data?.id,
          data?.projectId,
          queryClient,
        ),
        deleteSubtasksFromList: eagerUpdaterTaskDetail.deleteSubtaskFromList(
          data?.id,
          queryClient,
          data?.parentTaskId,
        ),

        // New Version
        ouTaskDetailSubtasks: queries.optimisticUpdates.tasks.lists.del(
          queries.tasks.detailSubtasks(data?.parentTaskId || "").queryKey,
          { id: data?.id },
          queryClient,
        ),
        outTaskDetailCompletedSubtasks:
          queries.optimisticUpdates.tasks.lists.del(
            queries.tasks.completedDetailSubtasks(data?.parentTaskId || "")
              .queryKey,
            { id: data?.id },
            queryClient,
          ),
      };
    },
    onError: (_err, _var, onMutateResult) => {
      console.log(_err);
      if (onMutateResult?.tasksProject?.oldData) {
        queryClient.setQueryData(
          onMutateResult?.tasksProject?.queryKey,
          onMutateResult?.tasksProject?.oldData,
        );
      }

      if (onMutateResult?.deleteSubtasksFromList?.oldData) {
        queryClient.setQueryData(
          onMutateResult?.deleteSubtasksFromList?.queryKey,
          onMutateResult?.deleteSubtasksFromList?.oldData,
        );
      }

      if (onMutateResult?.ouTaskDetailSubtasks?.oldData) {
        queryClient.setQueryData(
          onMutateResult?.ouTaskDetailSubtasks?.queryKey,
          onMutateResult?.ouTaskDetailSubtasks?.oldData,
        );
      }

      if (onMutateResult?.outTaskDetailCompletedSubtasks?.oldData) {
        queryClient.setQueryData(
          onMutateResult?.outTaskDetailCompletedSubtasks?.queryKey,
          onMutateResult?.outTaskDetailCompletedSubtasks?.oldData,
        );
      }
    },
    onSuccess: (_data, _variables, onMutateResult) => {
      if (onMutateResult?.tasksProject?.queryKey) {
        queryClient.invalidateQueries({
          queryKey: onMutateResult?.tasksProject?.queryKey,
        });
      }

      if (onMutateResult?.deleteSubtasksFromList?.queryKey) {
        queryClient.invalidateQueries({
          queryKey: onMutateResult?.deleteSubtasksFromList?.queryKey,
        });
      }

      if (onMutateResult?.ouTaskDetailSubtasks?.queryKey) {
        queryClient.invalidateQueries({
          queryKey: onMutateResult?.ouTaskDetailSubtasks?.queryKey,
        });
      }

      if (onMutateResult?.outTaskDetailCompletedSubtasks?.queryKey) {
        queryClient.invalidateQueries({
          queryKey: onMutateResult?.outTaskDetailCompletedSubtasks?.queryKey,
        });
      }
    },
  });

  return mutation;
};
