import { AuthResponse } from "../supabase/auth/actions";

export function constructAuthResponse(error: unknown) {
  return `code=${(error as AuthResponse)?.code ?? "unknown_error"}&message=${encodeURIComponent((error as AuthResponse)?.message ?? "Unknown error")}`;
}

export function constructCodeAndMessage(code: string, message: string) {
  return `code=${code}&message=${encodeURIComponent(message)}`;
}
