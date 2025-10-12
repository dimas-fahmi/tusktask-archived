import { DEFAULT_EMAIL_COOLDOWN } from "@/src/lib/configs";
import { createServiceClient } from "@/src/lib/supabase/instances/service";
import type { EmailStatus } from "@/src/lib/types/supabase";
import { createResponse } from "@/src/lib/utils/createResponse";
import type { AuthError } from "@supabase/supabase-js";
import type { PostgresError } from "postgres";

export async function resetPasswordResendHandler(email: string, PATH: string) {
  // Initiate supabase instance
  const supabase = await createServiceClient();

  // Fetch EmailStatus
  let emailStatus: EmailStatus;

  try {
    const { data, error } = await supabase.rpc("get_user_email_status", {
      email,
    });

    if (error) {
      throw error;
    }

    emailStatus = data[0];
  } catch (error) {
    return createResponse(
      500,
      (error as PostgresError)?.code ?? "unknown_message",
      (error as PostgresError)?.message ?? "Unknown error",
      undefined,
    );
  }

  // Time
  const present = new Date();
  const recoverySentAt = emailStatus?.recovery_sent_at
    ? new Date(emailStatus?.recovery_sent_at)
    : null;
  let isPassedCooldown = true;

  // Cooldown
  if (recoverySentAt) {
    const diff = present.getTime() - recoverySentAt.getTime();
    isPassedCooldown = diff >= DEFAULT_EMAIL_COOLDOWN;

    if (!isPassedCooldown) {
      return createResponse(
        429,
        "too_many_request",
        "Not yet passed cooldown",
        undefined,
      );
    }
  }

  // Executions
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw error;
    }

    return createResponse(
      200,
      "success_reset_password_sent",
      "Reset password instructions successfully sent",
      undefined,
    );
  } catch (error) {
    return createResponse(
      500,
      (error as AuthError)?.code ?? "unknown_message",
      (error as AuthError)?.message ?? "Unknown error",
      undefined,
      true,
      `${PATH}:${JSON.stringify(error)}`,
    );
  }
}
