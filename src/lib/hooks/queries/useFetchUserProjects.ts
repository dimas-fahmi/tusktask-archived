import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { ProjectsGetRequest } from "@/app/api/projects/get";
import type { StandardizeResponse } from "../../utils/createResponse";
import { fetchUserProjects } from "../../utils/fetchers/fetchUserProjects";

export const useFetchUserProjects = <T>(
  options: UseQueryOptions<
    StandardizeResponse<T>,
    StandardizeResponse<unknown>
  >,
  req?: ProjectsGetRequest,
) => {
  const query = useQuery({
    queryFn: () => fetchUserProjects<T>(req),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    ...options,
  });

  return query;
};
