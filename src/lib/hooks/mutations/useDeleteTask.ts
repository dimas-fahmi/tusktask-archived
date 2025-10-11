import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eagerUpdaterTasksProject } from "../../utils/eagerUpdater/tasks/project";

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (req: { id: string; projectId: string }) => {
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
          queryClient
        ),
      };
    },
    onError: (_err, _var, onMutateResult) => {
      if (onMutateResult?.tasksProject?.oldData) {
        queryClient.setQueryData(
          onMutateResult?.tasksProject?.queryKey,
          onMutateResult?.tasksProject?.oldData
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: ["projects"],
        exact: false,
      });
    },
  });

  return mutation;
};
