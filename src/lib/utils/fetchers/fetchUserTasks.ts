import type { TasksGetRequest, TasksGetResponse } from "@/app/api/tasks/get";
import { APP_URL } from "../../configs";
import { objectToQueryString } from "../objectToQueryString";

export async function fetchUserTasks(
  req?: TasksGetRequest,
  options?: RequestInit,
): Promise<TasksGetResponse> {
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
