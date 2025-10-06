import { TasksPostRequest } from "@/app/api/tasks/post";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { StandardizeResponse } from "../../utils/createResponse";

export const useCreateTask = <T>(
  mutationKey: string[],
  options?: UseMutationOptions<StandardizeResponse<T>, Error, TasksPostRequest>
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey,
    mutationFn: async (req: TasksPostRequest) => {
      const response = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify(req),
      });

      const result = await response.json();

      if (!response.ok) {
        throw result;
      }

      return result;
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

    ...options,
  });

  return mutation;
};
