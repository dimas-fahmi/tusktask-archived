import { InsertProfile, Profile, profiles } from "@/src/db/schema/profiles";
import { NextRequest } from "next/server";
import { createResponse } from "@/src/lib/utils/createResponse";
import { createServerClient } from "@/src/lib/supabase/instances/server";
import { profileSchema } from "@/src/lib/zod/schemas/authSchema";
import { prettifyError } from "zod";
import { db } from "@/src/db";
import { eq } from "drizzle-orm";

const PATH = "API_USERS_PROFILES_PATCH";

export interface UsersProfilesPatchRequest {
  newValues: Partial<Profile>;
}

export async function usersProfilesPatch(req: NextRequest) {
  // Parse Body
  let body: UsersProfilesPatchRequest;

  try {
    body = await req.json();
  } catch (_error) {
    return createResponse(400, "bad_request", "Invalid JSON body", undefined);
  }

  const { newValues } = body;

  //  Initialize Supabase client
  const supabase = await createServerClient();

  // Validate Session
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return createResponse(
      401,
      "invalid_session",
      "Session is invalid, please sign in.",
      undefined
    );
  }

  const user = data?.user;

  // Validate newValues [prevent from changing userId]
  if (newValues?.userId) {
    return createResponse(
      403,
      "forbidden_field_included",
      "New values contained forbidden field",
      undefined
    );
  }

  const validation = profileSchema.partial().safeParse(newValues);

  if (!validation.success) {
    return createResponse(
      400,
      "bad_request",
      prettifyError(validation.error),
      undefined
    );
  }

  // Construct new profile
  const newProfile: Omit<InsertProfile, "userId"> = {
    ...validation.data,
  };

  // Execution
  try {
    const response = await db
      .update(profiles)
      .set(newProfile)
      .where(eq(profiles.userId, user.id))
      .returning();

    return createResponse(
      200,
      "success_update_profiles",
      "Profile record updated",
      response
    );
  } catch (error) {
    return createResponse(
      500,
      "unkown_error",
      "Unknown error",
      undefined,
      true,
      `${PATH}:${JSON.stringify(error)}`
    );
  }
}
