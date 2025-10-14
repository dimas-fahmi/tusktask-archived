import {
  and,
  count,
  eq,
  gte,
  ilike,
  isNotNull,
  isNull,
  lt,
  lte,
} from "drizzle-orm";
import type { NextRequest } from "next/server";
import type { PostgresError } from "postgres";
import { db } from "@/src/db";
import { type Task, tasks } from "@/src/db/schema/tasks";
import { OperationError, type StandardizedError } from "@/src/lib/errors";
import { createServerClient } from "@/src/lib/supabase/instances/server";
import type { Pagination, Sorting } from "@/src/lib/types/app";
import { createLog } from "@/src/lib/utils/createLog";
import {
  createResponse,
  type StandardizeResponse,
} from "@/src/lib/utils/createResponse";
import { getRelationDepth } from "@/src/lib/utils/getRelationDepth";

const PATH = "API_TASKS_GET";

export type TasksGetRequestDateFields = keyof Pick<
  Task,
  "completedAt" | "deadlineAt" | "createdAt" | "reminderAt"
>;

export const VALID_TASKS_GET_REQUEST_DATE_FIELDS: TasksGetRequestDateFields[] =
  ["completedAt", "deadlineAt", "reminderAt", "createdAt"];

export interface TasksGetRequest extends Task {
  include?: string;
  limit?: number;
  offset?: number;
  orderBy?: TasksGetRequestDateFields | "name";
  orderDirection?: "asc" | "desc";

  // By Status
  isOverdue?: "true";
  isCompleted?: "true";
  isSoon?: number;
  isTomorrow?: "true";

  // Filter by date
  date?: TasksGetRequestDateFields;
  from?: Date | string;
  to?: Date | string;
}

export type TasksGetResponse<TData> = StandardizeResponse<{
  data: TData;
  pagination: Pagination;
  sorting: Sorting;
}>;

export async function tasksGet(req: NextRequest) {
  try {
    // Validate Session
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new OperationError(
        "unauthorized",
        "Invalid session, login required",
        401,
      );
    }

    // Query buildings
    const url = req.nextUrl;
    const parameters = Object.fromEntries(
      url.searchParams.entries(),
    ) as unknown as TasksGetRequest;

    // Parse pagination
    const limit = Math.min(
      parameters?.limit ? Math.max(1, Number(parameters.limit)) : 20,
      100,
    );
    const offset = parameters?.offset
      ? Math.max(0, Number(parameters.offset))
      : 0;

    // Parse ordering
    const orderDirection =
      parameters?.orderDirection === "asc" ? "asc" : "desc";
    const validOrderFields = [...VALID_TASKS_GET_REQUEST_DATE_FIELDS, "name"];

    const orderField =
      parameters?.orderBy &&
      validOrderFields.includes(parameters?.orderBy as string)
        ? parameters.orderBy
        : "createdAt";

    const where = [];

    // Always search by owner id
    where.push(eq(tasks.ownerId, user.id));

    // Search By Id
    if (parameters?.id) {
      where.push(eq(tasks.id, parameters.id));
    }

    // Search by name
    if (parameters?.name) {
      where.push(ilike(tasks.name, `%${parameters.name}%`));
    }

    // Search by project
    if (parameters?.projectId) {
      where.push(eq(tasks.projectId, parameters.projectId));
    }

    // Search by parent task
    if (parameters?.parentTask) {
      where.push(eq(tasks.parentTask, parameters.parentTask));
    }

    // Search by priority
    if (parameters?.taskPriority) {
      where.push(eq(tasks.taskPriority, parameters.taskPriority));
    }

    // Search by status
    if (parameters?.taskStatus) {
      where.push(eq(tasks.taskStatus, parameters?.taskStatus));
    }

    // Always return active tasks, except if parameters "isCompleted" set to true
    if (parameters?.isCompleted === "true") {
      where.push(isNotNull(tasks?.completedAt));
    } else {
      where.push(isNull(tasks?.completedAt));
    }

    // Filter overdue tasks (won't be applied if `isCompleted=true`)
    if (
      parameters?.isOverdue === "true" &&
      parameters?.isCompleted !== "true"
    ) {
      where.push(lt(tasks.deadlineAt, new Date()));
    }

    // If provided, `isSoon` represents milliseconds (e.g., 900000 = 15 minutes)
    const soonWindow = Number(parameters?.isSoon);

    if (
      parameters?.isSoon &&
      !Number.isNaN(soonWindow) &&
      parameters?.isCompleted !== "true"
    ) {
      const now = new Date();
      const range = new Date(now.getTime() + soonWindow);

      where.push(and(gte(tasks.deadlineAt, now), lt(tasks.deadlineAt, range)));
    }

    // Filter tasks due tomorrow (won’t be applied if isCompleted=true or isSoon=true)
    if (
      parameters?.isTomorrow === "true" &&
      parameters?.isCompleted !== "true" &&
      !parameters?.isSoon
    ) {
      const now = new Date();
      const tomorrowStart = new Date(now);
      tomorrowStart.setDate(now.getDate() + 1);
      tomorrowStart.setHours(0, 0, 0, 0);

      const tomorrowEnd = new Date(tomorrowStart);
      tomorrowEnd.setHours(23, 59, 59, 999);

      where.push(
        and(
          gte(tasks.deadlineAt, tomorrowStart),
          lte(tasks.deadlineAt, tomorrowEnd),
        ),
      );
    }

    // Date range filter
    if (parameters?.date && parameters?.from && parameters?.to) {
      const dateField = parameters.date;

      if (VALID_TASKS_GET_REQUEST_DATE_FIELDS.includes(dateField)) {
        const fromDate = new Date(parameters.from);
        const toDate = new Date(parameters.to);

        if (
          Number.isNaN(fromDate.getTime()) ||
          Number.isNaN(toDate.getTime())
        ) {
          throw new OperationError("bad_request", "Invalid date range", 400, {
            date: parameters.date,
            from: parameters.from,
            to: parameters.to,
          });
        }

        where.push(
          and(gte(tasks[dateField], fromDate), lte(tasks[dateField], toDate)),
        );
      }
    }

    // Relations
    const includeParameters = parameters?.include?.split(",") || [];

    // @ts-expect-error Recursively build `with` object for parent
    function buildParentWith(depth: number) {
      if (depth <= 0) return undefined;
      return {
        parent: {
          with: buildParentWith(depth - 1),
        },
      };
    }

    // @ts-expect-error Recursively build `with` object for subtasks
    function buildSubtasksWith(depth: number) {
      if (depth <= 0) return undefined;
      return {
        subtasks: {
          with: buildSubtasksWith(depth - 1),
        },
      };
    }

    // Executions
    try {
      const [response, totalCount] = await Promise.all([
        db.query.tasks.findMany({
          where: and(...where),
          with: {
            // Parents
            ...(getRelationDepth(includeParameters, "parent") > 0 &&
              buildParentWith(getRelationDepth(includeParameters, "parent"))),

            // Subtasks
            ...(getRelationDepth(includeParameters, "subtasks") > 0 &&
              buildSubtasksWith(
                getRelationDepth(includeParameters, "subtasks"),
              )),

            // Project
            ...(includeParameters?.includes("project") && {
              project: true,
            }),

            // Master Task
            ...(includeParameters?.includes("masterTask") && {
              masterTask: true,
            }),

            // Owner
            ...(includeParameters?.includes("owner") && {
              owner: true,
            }),
          },
          orderBy: (tasks, { asc, desc }) =>
            orderDirection === "asc"
              ? asc(tasks[orderField])
              : desc(tasks[orderField]),
          limit,
          offset,
        }),
        db
          .select({ count: count() })
          .from(tasks)
          .where(and(...where)),
      ]);

      const isFound = !!response?.length;

      // Return Response to client
      return createResponse(
        isFound ? 200 : 404,
        isFound ? "success_fetched_tasks" : "not_found",
        isFound ? "Tasks found and fetched" : "No tasks is found",
        {
          data: response,
          pagination: {
            limit,
            offset,
            total: totalCount[0]?.count,
            hasMore: offset + limit < totalCount[0].count,
          },
          sorting: {
            orderBy: orderField,
            orderDirection,
          },
        },
      );
    } catch (error) {
      throw new OperationError(
        "database_error",
        "Failed when fetching tasks",
        500,
        error,
      );
    }

    // Return Errors
  } catch (error) {
    // Create Error
    const err: StandardizedError = {
      code: (error as OperationError)?.code ?? "unknown_error",
      message: (error as OperationError)?.message ?? "Unknown error",
      status: (error as OperationError)?.status || 500,
    };

    // Log Information To Server
    createLog(PATH, {
      ...err,
      code:
        ((error as OperationError)?.context as PostgresError)?.code ||
        "unknown_error",
      message:
        ((error as OperationError)?.context as PostgresError)?.message ||
        "Unknown error",
      context: (error as OperationError)?.context,
    });

    // Response To Client
    return createResponse(err.status || 500, err.code, err.message, undefined);
  }
}
