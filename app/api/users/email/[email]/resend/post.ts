import { createResponse } from "@/src/lib/utils/createResponse";
import { emailSchema } from "@/src/lib/zod/schemas/authSchema";
import { NextRequest } from "next/server";
import { signupResendHandler } from "./handlers/signupResendHandler";

const PATH = "API_USERS_EMAIL_RESEND_POST";

export const RESEND_TYPES = ["signup", "otp"] as const;

export interface UsersEmailResendPostRequest {
  type: (typeof RESEND_TYPES)[number];
}

export async function usersEmailResendPost(
  req: NextRequest,
  context: { params: Promise<{ email: string }> }
) {
  // Parse Body
  let body: UsersEmailResendPostRequest;

  try {
    body = await req.json();
  } catch (_error) {
    return createResponse(
      400,
      "bad_request",
      "Request is not properly formed, expected: JSON",
      undefined
    );
  }

  const { type } = body;

  // Get Email
  const { email } = await context.params;

  // Validate Type
  if (!RESEND_TYPES.includes(type)) {
    return createResponse(
      400,
      "bad_request",
      "Invalid or unsupported resend type",
      undefined
    );
  }

  // Validate Email
  if (!email) {
    return createResponse(
      400,
      "bad_request",
      "Missing email parameter",
      undefined
    );
  }

  const validation = emailSchema.safeParse(email);

  if (!validation.success) {
    return createResponse(400, "bad_request", "Invalid email", undefined);
  }

  // Executions
  switch (type) {
    case "otp":
      return createResponse(
        500,
        "not_yet_implemented",
        "This Endpoint is not yet implemented",
        undefined
      );
    case "signup":
      return signupResendHandler(email, PATH);
    default:
      return createResponse(
        400,
        "bad_request",
        "Invalid or unsupported resend type",
        undefined
      );
  }
}
