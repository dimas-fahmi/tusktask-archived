import { useQuery } from "@tanstack/react-query";
import { fetchProfiles } from "../../utils/fetchers/fetchProfiles";
import { UsersProfilesGetRequest } from "@/app/api/users/profiles/get";
import { StandardizeResponse } from "../../utils/createResponse";

export const useFetchProfile = (
  { id, username, name }: UsersProfilesGetRequest,
  enabled: boolean
) => {
  const query = useQuery({
    queryKey: [
      "profile",
      `${id ? `id=${id}` : ""}${username ? `username=${username}` : ""}${name ? `name=${name}` : ""}`,
    ],
    enabled: enabled,
    queryFn: async () => {
      if (!enabled) return null;
      const response = await fetchProfiles({ id, username, name });

      return response?.result?.[0];
    },
    refetchOnWindowFocus: false,
    retry: (c, error) => {
      // Do not retry if status is 404
      const standardError = error as unknown as StandardizeResponse<undefined>;
      if (standardError?.status === 404) {
        console.log("status is 404, stop retrying");
        return false;
      }

      // Retry twice
      return c < 2;
    },
  });

  return query;
};
