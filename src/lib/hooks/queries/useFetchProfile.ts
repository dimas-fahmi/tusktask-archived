import { useQuery } from "@tanstack/react-query";
import { fetchProfiles } from "../../utils/fetchers/fetchProfiles";
import { UsersProfilesGetRequest } from "@/app/api/users/profiles/get";

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
  });

  return query;
};
