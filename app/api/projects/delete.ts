import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { db } from "@/src/db";
import { type Project, projects } from "@/src/db/schema/projects";
import { OperationError } from "@/src/lib/errors";
import { createServerClient } from "@/src/lib/supabase/instances/server";
import { createResponse } from "@/src/lib/utils/createResponse";

const PATH = "API_PROJECTS_DELETE";

export async function projectsDelete(req: NextRequest) {
  // Validate Session
  const supabase = await createServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    return createResponse(
      401,
      "unauthorized",
      "Invalid session, login required",
      undefined,
    );
  }

  // Extract Paramaters
  const url = req.nextUrl;
  const { projectId } = Object.fromEntries(url.searchParams.entries());

  // Validate
  if (!projectId) {
    return createResponse(
      400,
      "bad_request",
      "Missing important parameters: projectId",
      undefined,
    );
  }

  // Executions
  try {
    const [response] = await db.transaction(async (tx) => {
      // validate Ownership
      let project: Project | undefined;
      try {
        project = await tx.query.projects.findFirst({
          where: eq(projects.id, projectId),
        });
      } catch (_error) {
        throw new OperationError(
          "database_error",
          "Failed when fetching target project",
        );
      }

      if (!project) {
        throw new OperationError(
          "bad_request",
          "Project is not found on database",
        );
      }

      if (project.ownerId !== user.id) {
        throw new OperationError(
          "unathorized",
          "User is not the owner of the project",
        );
      }

      // Delete
      try {
        const ops = await tx
          .delete(projects)
          .where(eq(projects.id, projectId))
          .returning();

        return ops;
      } catch (_error) {
        throw new OperationError(
          "database_error",
          "Failed when deleting project",
        );
      }
    });

    return createResponse(
      200,
      "success_delete_project",
      "Project is deleted",
      response,
    );
  } catch (error) {
    return createResponse(
      500,
      "unknown_error",
      "Unknown error",
      undefined,
      true,
      `${PATH}:${JSON.stringify(error)}`,
    );
  }
}
