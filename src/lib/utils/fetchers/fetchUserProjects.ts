import { ProjectsGetRequest } from "@/app/api/projects/get";
import { StandardizeResponse } from "../createResponse";
import { Project } from "@/src/db/schema/projects";
import { objectToQueryString } from "../objectToQueryString";

export async function fetchUserProjects(
  req?: ProjectsGetRequest
): Promise<StandardizeResponse<Project[]>> {
  // Construct query string
  const query = objectToQueryString(req as Record<string, string>);

  const response = await fetch(`/api/projects?${query}`);
  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
