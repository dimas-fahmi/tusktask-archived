import {
  type UseQueryOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { TasksGetRequest, TasksGetResponse } from "@/app/api/tasks/get";
import type { StandardizeResponse } from "../../utils/createResponse";
import { fetchUserTasks } from "../../utils/fetchers/fetchUserTasks";

export const useFetchUserTasks = (
  queryKey: Readonly<string[]>,
  req?: TasksGetRequest,
  options?: UseQueryOptions<TasksGetResponse>,
) => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchUserTasks(req),
    retry: (count, data) => {
      const error = data as unknown as StandardizeResponse<unknown>;
      const status = error?.status;

      // Do not retry if the status is 404
      if (status === 404) {
        // Treat 404 as successful but not found
        queryClient.setQueryData(queryKey, data);
        return false;
      }

      return count <= 2;
    },
    ...options,
  });

  return query;
};
