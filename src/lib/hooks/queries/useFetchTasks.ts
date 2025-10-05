import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "../../utils/fetchers/fetchTasks";
import { TasksGetRequest } from "@/app/api/tasks/get";

export const useFetchTasks = <T>(queryKey: string[], req?: TasksGetRequest) => {
  const query = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchTasks<T>(req),
  });

  return query;
};
