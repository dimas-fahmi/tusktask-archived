import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchTasks } from "../../utils/fetchers/fetchTasks";
import { TasksGetRequest } from "@/app/api/tasks/get";
import { StandardizeResponse } from "../../utils/createResponse";

export const useFetchTasks = <T>(
  queryKey: string[],
  req?: TasksGetRequest,
  options?: UseQueryOptions<StandardizeResponse<T>>
) => {
  const query = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchTasks<T>(req),
    retry: (count, data) => {
      const error = data as unknown as StandardizeResponse<unknown>;
      const status = error?.status;

      // Do not retry if the status is 404
      if (status === 404) {
        return false;
      }

      return count <= 2;
    },
    ...options,
  });

  return query;
};
