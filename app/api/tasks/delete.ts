import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import z, { prettifyError } from "zod";
import { db } from "@/src/db";
import { type Task, tasks } from "@/src/db/schema/tasks";
import { OperationError } from "@/src/lib/errors";
import { createServerClient } from "@/src/lib/supabase/instances/server";
import { createResponse } from "@/src/lib/utils/createResponse";

export interface TasksDeleteRequest {
  id: string;
}

const PATH = "API_TASKS_DELETE";

export async function tasksDelete(req: NextRequest) {
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

  // Extract Query Parameters
  const url = req.nextUrl;
  const { id } = Object.fromEntries(
    url.searchParams.entries(),
  ) as unknown as TasksDeleteRequest;

  // Validate id existence
  if (!id) {
    return createResponse(
      400,
      "bad_request",
      "Missing important parameters: ID",
      undefined,
    );
  }

  // Validate ID type
  const validation = z.uuid().safeParse(id);

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
      let task: Task | undefined;

      try {
        task = await tx.query.tasks.findFirst({
          where: eq(tasks.id, validation.data),
        });
      } catch (_error) {
        throw new OperationError(
          "database_error",
          "Failed when fetching task information",
        );
      }

      if (!task) {
        throw new OperationError("bad_request", "Task doesn't exist");
      }

      if (task.ownerId !== user.id) {
        throw new OperationError(
          "unauthorized",
          "User's not the owner of the task",
        );
      }

      // 2. Execute deletion
      try {
        return await tx
          .delete(tasks)
          .where(eq(tasks.id, validation.data))
          .returning();
      } catch (_error) {
        throw new OperationError("database_error", "Failed when deleting task");
      }
    });

    return createResponse(
      200,
      "success_delete_task",
      "Task is deleted",
      response,
    );
  } catch (error) {
    return createResponse(
      500,
      "unknown_error",
      "Unknown Error",
      undefined,
      true,
      `${PATH}:${JSON.stringify(error)}`,
    );
  }
}
