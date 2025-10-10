import { db } from "@/src/db";
import { Task, tasks, TaskUpdateSchema } from "@/src/db/schema/tasks";
import { OperationError } from "@/src/lib/errors";
import { createServerClient } from "@/src/lib/supabase/instances/server";
import { createResponse } from "@/src/lib/utils/createResponse";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import z, { prettifyError } from "zod";

const PATH = "API_TASKS_PATCH";

export interface TasksPatchRequest {
  id: string;
  newValues: Partial<Task>;
}

export async function tasksPatch(req: NextRequest) {
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

  // Parse Request
  let body: TasksPatchRequest;

  try {
    body = await req.json();
  } catch (error) {
    return createResponse(
      400,
      "bad_request",
      "Invalid request form, expected: raw JSON",
      undefined,
      true,
      `${PATH}:${JSON.stringify(error)}`
    );
  }

  // Validate Request
  const { id, newValues } = body;

  if (!id) {
    return createResponse(
      400,
      "bad_request",
      "Missing important parameter: id",
      undefined
    );
  }

  if (!newValues) {
    return createResponse(
      400,
      "bad_request",
      "Missing important parameter: newValues",
      undefined
    );
  }

  const validation = TaskUpdateSchema.omit({
    id: true,
    createdAt: true,
    masterTasks: true,
  })
    .strict()
    .extend({
      deadlineAt: z.coerce.date().optional().nullable(),
      reminderAt: z.coerce.date().optional().nullable(),
      completedAt: z.coerce.date().optional().nullable(),
    })
    .safeParse(newValues);

  if (!validation.success) {
    return createResponse(
      400,
      "bad_request",
      prettifyError(validation.error),
      undefined,
      true,
      `${PATH}`
    );
  }

  // Executions
  try {
    const response = await db.transaction(async (tx) => {
      // 1. Validate Ownership
      let oldTask: Task | undefined;
      try {
        oldTask = await tx.query.tasks.findFirst({
          where: eq(tasks.id, id),
        });
      } catch (_error) {
        throw new OperationError(
          "database_error",
          "Failed when fetching information about old task"
        );
      }

      if (!oldTask) {
        throw new OperationError(
          "bad_request",
          "Failed to find information about old task"
        );
      }

      if (oldTask.ownerId !== user.id) {
        throw new OperationError(
          "unauthorized",
          "Not the owner of the task, operation aborted"
        );
      }

      // 2. Execute update
      try {
        const response = await tx
          .update(tasks)
          .set({
            ...validation.data,
          })
          .where(eq(tasks.id, id))
          .returning();

        return response;
      } catch (_error) {
        throw new OperationError("database_error", "Failed when updating task");
      }
    });

    return createResponse(200, "success_update_task", "Task updated", response);
  } catch (error) {
    const er = error as OperationError;

    return createResponse(
      500,
      er?.code || "unknown_error",
      er?.message || "Unknown error",
      undefined,
      true,
      `${PATH}:${JSON.stringify(error)}`
    );
  }
}
