import type { ProjectsGetRequest } from "@/app/api/projects/get";
import { APP_URL } from "../../configs";
import type { StandardizeResponse } from "../createResponse";
import { objectToQueryString } from "../objectToQueryString";

export async function fetchUserProjects<T>(
  req?: ProjectsGetRequest,
  options?: RequestInit,
): Promise<StandardizeResponse<T>> {
  // Construct query string
  const query = objectToQueryString(req as Record<string, string>);

  const response = await fetch(`${APP_URL}/api/projects?${query}`, {
    method: "GET",
    ...options,
  });
  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
