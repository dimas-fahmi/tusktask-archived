import { NextRequest } from "next/server";
import { createResponse } from "@/src/lib/utils/createResponse";
import { passwordResetSchema } from "@/src/lib/zod/schemas/authSchema";
import { prettifyError } from "zod";
import { createServiceClient } from "@/src/lib/supabase/instances/service";
import { AuthError } from "@supabase/supabase-js";

export interface UsersPasswordPathRequest {
  password: string;
  passwordConfirmation: string;
}

export async function usersPasswordPath(req: NextRequest) {
  // Parse body
  let body: UsersPasswordPathRequest;

  try {
    body = await req.json();
  } catch (_error) {
    return createResponse(400, "bad_request", "Invalid JSON body", undefined);
  }

  const { password, passwordConfirmation } = body;

  if (!password || !passwordConfirmation) {
    return createResponse(
      400,
      "bad_request",
      "Missing password or confirmation parameter",
      undefined
    );
  }

  // Validation
  const validation = passwordResetSchema.safeParse({
    password,
    passwordConfirmation,
  });

  if (!validation.success) {
    return createResponse(
      400,
      "bad_request",
      prettifyError(validation.error),
      undefined
    );
  }

  // Initialize supabase
  const supabase = await createServiceClient();

  // Validate Window
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return createResponse(
      400,
      error?.code ?? "unknown_error",
      error?.message ?? "Unknown error",
      undefined
    );
  }

  const user = data.user;
  const resetWindow = user.app_metadata?.reset_password_window;
  const now = new Date();
  const window = resetWindow ? new Date(resetWindow) : null;
  const isExpired = !window ? true : window.getTime() < now.getTime();

  if (!resetWindow || !window || isExpired) {
    return createResponse(
      401,
      "Unauthorized or window is expired",
      "Either password reset window is not exist or expired",
      undefined
    );
  }

  console.log(password, passwordConfirmation);

  // Execute
  try {
    await supabase.auth.admin.updateUserById(user.id, {
      app_metadata: {
        reset_password_window: null,
      },
    });
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      throw error;
    }

    return createResponse(200, "success", "password updated", undefined);
  } catch (error) {
    return createResponse(
      200,
      (error as AuthError)?.code ?? "unknown_error",
      (error as AuthError)?.message ?? "Unknown error",
      undefined
    );
  }
}
