import { and, eq, ilike } from "drizzle-orm";
import type { NextRequest } from "next/server";
import type { PostgresError } from "postgres";
import { db } from "@/src/db";
import { profiles } from "@/src/db/schema/profiles";
import { createResponse } from "@/src/lib/utils/createResponse";

export interface UsersProfilesGetRequest {
  username?: string;
  name?: string;
  id?: string;
}

export async function usersProfilesGet(req: NextRequest) {
  // Extract Parameters
  const url = req.nextUrl;
  const { id, name, username } = Object.fromEntries(
    url.searchParams.entries(),
  ) as UsersProfilesGetRequest;

  // Validate
  if (!id && !name && !username) {
    return createResponse(
      400,
      "bad_request",
      "Missing query parameters, provide at least one either id,name or username",
      undefined,
    );
  }

  // Query Builder
  const query = [];

  if (id) {
    query.push(eq(profiles.userId, id));
  }

  if (username) {
    query.push(eq(profiles.username, `${username}`));
  }

  if (name) {
    query.push(ilike(profiles.name, `%${name}%`));
  }

  // Executions
  try {
    const response = await db.query.profiles.findMany({
      where: and(...query),
    });

    const isFound = response?.length > 0;

    return createResponse(
      isFound ? 200 : 404,
      isFound ? "success_found" : "not_found",
      isFound ? "Record found" : "No such record found",
      response,
    );
  } catch (error) {
    return createResponse(
      500,
      (error as PostgresError)?.code ?? "unknown_error",
      (error as PostgresError)?.message ?? "Unknown error",
      undefined,
    );
  }
}
