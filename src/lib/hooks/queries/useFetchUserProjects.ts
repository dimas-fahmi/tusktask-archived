import { ProjectsGetRequest } from "@/app/api/projects/get";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProjects } from "../../utils/fetchers/fetchUserProjects";

export const useFetchUserProject = <T>(req?: ProjectsGetRequest) => {
  const queryKey = req ? ["projects", JSON.stringify(req)] : ["projects"];

  const query = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchUserProjects<T>(req),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return query;
};
