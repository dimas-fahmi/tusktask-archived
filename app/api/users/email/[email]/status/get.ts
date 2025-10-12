import type { NextRequest } from "next/server";
import { createResponse } from "@/src/lib/utils/createResponse";
import { emailSchema } from "@/src/lib/zod/schemas/authSchema";
import { createServiceClient } from "@/src/lib/supabase/instances/service";
import type { PostgresError } from "postgres";

const PATH = "API_USERS_EMAIL_STATUS_GET";

export async function usersEmailStatusGet(
  _req: NextRequest,
  context: { params: Promise<{ email: string }> },
) {
  // Extract Params
  const { email } = await context.params;

  // Validate Email
  if (!email) {
    return createResponse(
      400,
      "bad_request",
      "Missing email parameter",
      undefined,
    );
  }

  const validation = emailSchema.safeParse(email);

  if (!validation.success) {
    return createResponse(400, "bad_request", "Invalid email", undefined);
  }

  // Initialize Supabase Instance
  const supabase = await createServiceClient();

  // Execute
  try {
    const { data, error } = await supabase.rpc("get_user_email_status", {
      email,
    });

    if (error) {
      throw error;
    }

    const isFound = data?.length > 0;

    return createResponse(
      isFound ? 200 : 404,
      isFound ? "success" : "not_found",
      isFound ? "Record found" : "Record not found",
      isFound ? data[0] : undefined,
    );
  } catch (error) {
    return createResponse(
      500,
      (error as PostgresError)?.code ?? "unknown_error",
      (error as PostgresError)?.message ?? "Unknown error",
      undefined,
      true,
      `${PATH}:${JSON.stringify(error)}`,
    );
  }
}
