import { ProjectsGetRequest } from "@/app/api/projects/get";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchUserProjects } from "../../utils/fetchers/fetchUserProjects";
import { StandardizeResponse } from "../../utils/createResponse";

export const useFetchUserProjects = <T>(
  options: UseQueryOptions<
    StandardizeResponse<T>,
    StandardizeResponse<unknown>
  >,
  req?: ProjectsGetRequest
) => {
  const query = useQuery({
    queryFn: () => fetchUserProjects<T>(req),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    ...options,
  });

  return query;
};
