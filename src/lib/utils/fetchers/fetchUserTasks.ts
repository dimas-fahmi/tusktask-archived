import type { TasksGetRequest } from "@/app/api/tasks/get";
import { APP_URL } from "../../configs";
import type { StandardizeResponse } from "../createResponse";
import { objectToQueryString } from "../objectToQueryString";

export async function fetchUserTasks<T>(
  req?: TasksGetRequest,
  options?: RequestInit,
): Promise<StandardizeResponse<T>> {
  const queryString = objectToQueryString(req as Record<string, string>);
  const response = await fetch(`${APP_URL}/api/tasks?${queryString}`, {
    method: "GET",
    ...options,
  });
  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
