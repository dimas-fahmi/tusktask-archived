import { db } from "@/src/db";
import {
  InsertProject,
  ProjectInsertSchema,
  projects,
} from "@/src/db/schema/projects";
import { createServerClient } from "@/src/lib/supabase/instances/server";
import { createResponse } from "@/src/lib/utils/createResponse";
import { NextRequest } from "next/server";
import { prettifyError } from "zod";

const PATH = "API_PROJECTS_POST";

export interface ProjectsPostRequest {
  newProject: Omit<InsertProject, "id" | "ownerId">;
}

export async function projectsPost(req: NextRequest) {
  // Validate Session
  const supabase = await createServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    return createResponse(
      401,
      "unauthorized",
      "Session invalid, login required",
      undefined
    );
  }

  // Parse Request
  let body: ProjectsPostRequest;

  try {
    body = await req.json();
  } catch (_error) {
    return createResponse(
      400,
      "bad_request",
      "Request is malformed, expected raw JSON",
      undefined
    );
  }

  const { newProject } = body;

  if (!newProject) {
    return createResponse(
      400,
      "bad_request",
      "Missing important parameters",
      undefined
    );
  }

  // Validate
  const validation = ProjectInsertSchema.omit({
    ownerId: true,
    id: true,
    createdAt: true,
  })
    .strict()
    .safeParse(newProject);

  if (!validation.success) {
    return createResponse(
      400,
      "bad_request",
      prettifyError(validation.error),
      undefined
    );
  }

  //  Construct new project
  const newProjectRequest: InsertProject = {
    id: crypto.randomUUID(),
    ownerId: user.id,
    projectType: validation.data?.projectType || "generic",
    ...validation.data,
  };

  // Execution
  try {
    const response = await db
      .insert(projects)
      .values(newProjectRequest)
      .returning();

    return createResponse(200, "connected", "hello world", response);
  } catch (error) {
    return createResponse(
      500,
      "unknown_error",
      "Unknown error",
      undefined,
      true,
      `${PATH}:${JSON.stringify(error)}`
    );
  }
}
