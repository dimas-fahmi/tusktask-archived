import { APP_URL } from "../../configs";
import { EmailStatus } from "../../types/supabase";
import { StandardizeResponse } from "../createResponse";

export const fetchEmailStatus = async (
  email?: string | null
): Promise<StandardizeResponse<EmailStatus> | undefined> => {
  if (!email) return undefined;

  const origin = APP_URL;

  if (!origin) {
    throw new Error("MISSING_ORIGIN_FROM_ENV");
  }

  const response = await fetch(`${origin}/api/users/email/${email}/status`);

  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
};
