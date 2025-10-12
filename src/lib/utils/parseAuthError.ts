import type { AuthError } from "@supabase/supabase-js";

export function parseAuthError(error: unknown) {
  return {
    success: false,
    code: (error as AuthError)?.code ?? "unknown_error",
    message: (error as AuthError)?.message ?? "Unknown error",
  };
}
