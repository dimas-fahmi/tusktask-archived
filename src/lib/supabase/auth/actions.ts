"use server";

import type { Session } from "@supabase/supabase-js";
import { prettifyError } from "zod";
import { parseAuthError } from "../../utils/parseAuthError";
import { registrationSchema, signInSchema } from "../../zod/schemas/authSchema";
import { createServerClient } from "../instances/server";

export interface AuthResponse {
  success: boolean;
  code: string;
  message: string;
  session?: Session;
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
  password: string,
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

export async function signup({
  email,
  password,
  passwordConfirmation,
}: {
  email: string;
  password: string;
  passwordConfirmation: string;
}): Promise<AuthResponse> {
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
