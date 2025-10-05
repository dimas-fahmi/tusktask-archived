import { NextRequest } from "next/server";
import { createResponse } from "@/src/lib/utils/createResponse";
import { and, eq, ilike } from "drizzle-orm";
import { projects } from "@/src/db/schema/projects";
import { createServerClient } from "@/src/lib/supabase/instances/server";
import { db } from "@/src/db";
import { OperationError } from "@/src/lib/errors";

const PATH = "API_PROJECTS_GET";

export interface ProjectsGetRequest {
  id?: string;
  name?: string;
  include?: string;
}

export async function projectsGet(req: NextRequest) {
  // Extract parameters
  const url = req.nextUrl;
  const { id, name, include } = Object.fromEntries(
    url.searchParams.entries()
  ) as ProjectsGetRequest;

  // Validate Session
  const supabase = await createServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    return createResponse(
      401,
      "unauthorized",
      "Invalid session, login required",
      undefined
    );
  }

  // Query Construction
  const query = [];

  // Always search by owner
  query.push(eq(projects.ownerId, user.id));

  if (id) {
    query.push(eq(projects.id, id));
  }

  if (name) {
    query.push(ilike(projects.name, `%${name}%`));
  }

  // Construct relations
  const includeArray = include ? include.split(",") : [];
  const withRelations: { owner?: true; tasks?: true } = {};
  if (includeArray?.includes("owner")) {
    withRelations.owner = true;
  }

  if (includeArray?.includes("tasks")) {
    withRelations.tasks = true;
  }

  // Executions
  try {
    const response = await db.query.projects.findMany({
      where: and(...query),
      with: {
        ...withRelations,
      },
    });

    const isFound = response.length > 0;

    return createResponse(
      isFound ? 200 : 404,
      isFound ? "success" : "not_found",
      isFound ? "Success fetched projects" : "No such project",
      response
    );
  } catch (error) {
    return createResponse(
      500,
      (error as OperationError)?.code ?? "Unknown error",
      (error as OperationError)?.message ?? "Unknown error",
      undefined,
      true,
      `${PATH}:${JSON.stringify(error)}`
    );
  }
}
