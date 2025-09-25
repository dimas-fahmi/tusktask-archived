"use server";

import { createServerClient } from "../instances/server";
import { registrationSchema, signInSchema } from "../../zod/schemas/authSchema";
import { AuthError, Session } from "@supabase/supabase-js";
import { prettifyError } from "zod";
import { AuthProvider, OAUTH_PROVIDERS } from "../../configs";

export interface AuthResponse {
  success: boolean;
  code: string;
  message: string;
  session?: Session;
}

function parseAuthError(error: unknown) {
  return {
    success: false,
    code: (error as AuthError)?.code ?? "unknown_error",
    message: (error as AuthError)?.message ?? "Unknown error",
  };
}

export async function getSession() {
  // Create Client
  const supabase = await createServerClient();

  // Request
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return parseAuthError(error);
  }

  return {
    success: true,
    code: "success",
    message: "Session exist",
    session: data?.session,
  };
}

export async function signIn(
  email: string,
  password: string
): Promise<AuthResponse> {
  // Create Supabase Instance
  const supabase = await createServerClient();

  // Validation
  const validation = signInSchema.safeParse({ email, password });

  if (!validation.success) {
    return {
      success: false,
      code: "bad_request",
      message: "Invalid email or password",
    };
  }

  // Request
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return parseAuthError(error);
  }

  return {
    success: true,
    code: "success",
    message: "Successfully signed in user",
    session: data?.session,
  };
}

export async function oAuthSignIn(
  provider: AuthProvider
): Promise<AuthResponse> {
  // Create Client
  const supabase = await createServerClient();

  // Validate
  if (!OAUTH_PROVIDERS.includes(provider)) {
    return {
      success: false,
      code: "bad_request",
      message: "Invalid oAuth provider",
    };
  }

  // Request
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
  });

  if (error) {
    return parseAuthError(error);
  }

  return {
    success: true,
    code: "success",
    message: "Successfully signed in",
  };
}

export async function signup(
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<AuthResponse> {
  // Create Supabase Client
  const supabase = await createServerClient();

  // Validate Request
  const validation = registrationSchema.safeParse({
    email,
    password,
    passwordConfirmation,
  });

  if (!validation.success) {
    return {
      success: false,
      code: "bad_request",
      message: prettifyError(validation.error),
    };
  }

  // Request
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return parseAuthError(error);
  }

  return {
    success: true,
    code: "success",
    message: "Successfully registered new users",
  };
}

export async function signOut(): Promise<AuthResponse> {
  // Create Client
  const supabase = await createServerClient();

  // Request
  const { error } = await supabase.auth.signOut();

  if (error) {
    return parseAuthError(error);
  }

  return {
    success: true,
    code: "success",
    message: "Signed out",
  };
}
