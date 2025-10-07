import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: "DELETE",
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
  });

  return mutation;
};
