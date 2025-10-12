import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProjectApp } from "../../types/projects";
import type { StandardizeResponse } from "../../utils/createResponse";

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const response = await fetch(`/api/projects?projectId=${projectId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw result;
      }

      return result;
    },
    onMutate: (data) => {
      queryClient.cancelQueries({ queryKey: ["projects"], exact: false });

      const oldData = queryClient.getQueryData([
        "projects",
        JSON.stringify({ include: "tasks" }),
      ]) as StandardizeResponse<ProjectApp[]>;

      if (oldData) {
        queryClient.setQueryData(
          ["projects", JSON.stringify({ include: "tasks" })],
          () => {
            const newList = oldData.result.filter((item) => item.id !== data);

            return {
              ...oldData,
              result: newList,
            };
          },
        );
      }

      return { oldData };
    },
    onError: (_error, _data, context) => {
      if (context?.oldData) {
        queryClient.setQueryData(
          ["projects", JSON.stringify({ include: "tasks" })],
          context.oldData,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["tasks"], exact: false });
    },
  });
};
