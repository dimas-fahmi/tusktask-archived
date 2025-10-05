import { db } from "@/src/db";
import { Project, projects } from "@/src/db/schema/projects";
import { InsertTask, tasks } from "@/src/db/schema/tasks";
import { OperationError } from "@/src/lib/errors";
import { createServerClient } from "@/src/lib/supabase/instances/server";
import { createResponse } from "@/src/lib/utils/createResponse";
import {
  NewTaskFormSchema,
  newTaskFormSchema,
} from "@/src/lib/zod/schemas/taskSchema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { prettifyError } from "zod";

const PATH = "API_TASKS_POST";

export interface TasksPostRequest {
  newTaskRequest: NewTaskFormSchema;
}

export async function tasksPost(req: NextRequest) {
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

  // Parse Body
  let body: TasksPostRequest;

  try {
    body = await req.json();
  } catch (_error) {
    return createResponse(
      400,
      "bad_request",
      "Invalid request form, expected: Raw JSON",
      undefined
    );
  }

  // Validate Request
  const { newTaskRequest } = body;

  if (!newTaskRequest) {
    return createResponse(
      400,
      "bad_request",
      "Missing important parameters: newTaskRequest",
      undefined
    );
  }

  // Validate with zod
  const validation = newTaskFormSchema.safeParse(newTaskRequest);

  if (!validation.success) {
    return createResponse(
      400,
      "bad_request",
      prettifyError(validation.error),
      undefined
    );
  }

  const validationData = validation.data;

  // Create Request
  const newTask: InsertTask = {
    // Spread request values
    ...validation.data,

    // Set ID & Ownership
    id: crypto.randomUUID(),
    ownerId: user.id,
  };

  // Execution
  try {
    const response = await db.transaction(async (tx) => {
      // 1. Validate Project
      let project: Project | undefined;

      try {
        project = await tx.query.projects.findFirst({
          where: eq(projects.id, validationData.projectId),
        });
      } catch (_error) {
        throw new OperationError(
          "database_error",
          "Failed when fetching project"
        );
      }

      if (!project) {
        throw new OperationError(
          "bad_request",
          "Project ID is invalid or project has been deleted"
        );
      }

      if (project.ownerId !== user.id) {
        throw new OperationError(
          "unauthorized",
          "Now the owner of the project"
        );
      }

      // 2. Executions
      try {
        const response = await tx.insert(tasks).values(newTask).returning();

        return response;
      } catch (_error) {
        throw new OperationError("database_error", "Failed when saving task");
      }
    });

    return createResponse(
      200,
      "success_created_task",
      "Task is created",
      response
    );
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
