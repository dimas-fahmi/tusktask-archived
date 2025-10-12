import type { AuthError } from "@supabase/supabase-js";
import type { PostgresError } from "postgres";
import { APP_URL, DEFAULT_EMAIL_COOLDOWN } from "@/src/lib/configs";
import { createServiceClient } from "@/src/lib/supabase/instances/service";
import type { EmailStatus } from "@/src/lib/types/supabase";
import { createResponse } from "@/src/lib/utils/createResponse";

export async function signupResendHandler(email: string, PATH: string) {
  // Create Client
  const supabase = await createServiceClient();

  // Fetch Email Status
  let emailStatus: EmailStatus;

  try {
    const { data, error } = await supabase.rpc("get_user_email_status", {
      email,
    });

    if (error) {
      throw error;
    }

    if (data?.length < 1) {
      return createResponse(
        404,
        "not_found",
        "Email is not found on database",
        undefined,
      );
    }

    emailStatus = data[0];
  } catch (error) {
    return createResponse(
      500,
      (error as PostgresError)?.code ?? "unknown_error",
      (error as PostgresError)?.message ??
        "Unknown Error while fetching email status",
      undefined,
    );
  }

  // Check if email already confirmed
  if (emailStatus?.email_confirmed_at) {
    return createResponse(
      400,
      "bad_request",
      "Email already confirmed",
      undefined,
    );
  }

  // Validate cooldown session
  const confirmationSentAt = emailStatus?.confirmation_sent_at
    ? new Date(emailStatus.confirmation_sent_at)
    : null;

  let isPassedCooldown = true;

  if (confirmationSentAt) {
    const present = new Date();
    const diff = present.getTime() - confirmationSentAt.getTime();

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

  // Execution
  try {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${APP_URL}/auth/email/confirmed?email=${encodeURIComponent(email)}`,
      },
    });

    if (error) {
      throw error;
    }

    return createResponse(200, "success", "Confirmation email sent", undefined);
  } catch (error) {
    return createResponse(
      500,
      (error as AuthError)?.code ?? "unknown_error",
      (error as AuthError)?.message ?? "Unknown error",
      undefined,
      true,
      `${PATH}:${JSON.stringify(error)}`,
    );
  }
}
