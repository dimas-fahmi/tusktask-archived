import { UsersProfilesGetRequest } from "@/app/api/users/profiles/get";
import { StandardizeResponse } from "../createResponse";
import { Profile } from "@/src/db/schema/profiles";
import { objectToQueryString } from "../objectToQueryString";

export async function fetchProfiles(
  req: UsersProfilesGetRequest
): Promise<StandardizeResponse<Profile[]>> {
  const response = await fetch(
    `/api/users/profiles?${objectToQueryString(req as Record<string, string>)}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
