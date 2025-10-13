import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import z, { prettifyError } from "zod";
import { db } from "@/src/db";
import {
  type Project,
  ProjectSchema,
  projects,
} from "@/src/db/schema/projects";
import { OperationError } from "@/src/lib/errors";
import { createServerClient } from "@/src/lib/supabase/instances/server";
import { createResponse } from "@/src/lib/utils/createResponse";

const PATH = "API_PROJECTS_PATCH";

export interface ProjectsPatchRequest {
  id: string;
  newValues: Partial<Project>;
}

export async function projectsPatch(req: NextRequest) {
  // Validate Session
  const supabase = await createServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    return createResponse(
      401,
      "unauthorized",
      "Session invalid, login required",
      undefined,
    );
  }

  // Parse Request
  let body: ProjectsPatchRequest;
  try {
    body = await req.json();
  } catch (_error) {
    return createResponse(
      400,
      "bad_request",
      "Malformed request, expected: Raw JSON",
      undefined,
    );
  }

  // Validate  request existence
  const { id, newValues } = body;

  if (!id) {
    return createResponse(
      400,
      "bad_request",
      "Missing important parameters: Id",
      undefined,
    );
  }

  if (!newValues) {
    return createResponse(
      400,
      "bad_request",
      "Missing important parameters: newValues",
      undefined,
    );
  }

  const validation = ProjectSchema.omit({ id: true, createdAt: true })
    .extend({
      deadlineAt: z.coerce.date().optional().nullable(),
    })
    .strict()
    .partial()
    .safeParse(newValues);

  if (!validation.success) {
    return createResponse(
      400,
      "bad_request",
      prettifyError(validation.error),
      undefined,
    );
  }

  // Executions
  try {
    const response = await db.transaction(async (tx) => {
      // 1. Validate ownership
      let project: Project | undefined;
      try {
        project = await tx.query.projects.findFirst({
          where: eq(projects.id, id),
        });
      } catch (_error) {
        throw new OperationError(
          "database_error",
          "Failed when fetching project's information",
        );
      }

      if (!project) {
        throw new OperationError(
          "bad_request",
          "No projects with provided id is found",
        );
      }

      if (project?.ownerId !== user.id) {
        throw new OperationError(
          "unauthorized",
          "Not the owner of the project",
        );
      }

      // 3. Execute
      try {
        return await tx
          .update(projects)
          .set({ ...validation.data })
          .where(eq(projects.id, id))
          .returning();
      } catch (_error) {
        throw new OperationError(
          "database_error",
          "Failed when updating project",
        );
      }
    });

    revalidateTag(`project-${id}`);
    return createResponse(
      200,
      "success_update_project",
      "Project's updated",
      response,
    );
  } catch (error) {
    if (error instanceof OperationError) {
      const status =
        error.code === "unauthorized"
          ? 401
          : error.code === "bad_request"
            ? 400
            : 500;

      return createResponse(status, error.code, error.message, undefined);
    }

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
