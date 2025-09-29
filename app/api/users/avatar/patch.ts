import { db } from "@/src/db";
import { Profile, profiles } from "@/src/db/schema/profiles";
import {
  ALLOWED_IMAGE_MAX_MIME_SIZE,
  ALLOWED_IMAGE_MIME_TYPES,
  VERCEL_BLOB_ID,
} from "@/src/lib/configs";
import { OperationError } from "@/src/lib/errors";
import { createServerClient } from "@/src/lib/supabase/instances/server";
import { createResponse } from "@/src/lib/utils/createResponse";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import sharp, { Metadata } from "sharp";
import { del, put, PutBlobResult } from "@vercel/blob";

export async function usersAvatarPatch(req: NextRequest) {
  // Validate Session
  const supabase = await createServerClient();
  const { data } = await supabase.auth.getUser();

  const user = data?.user;

  if (!user) {
    return createResponse(
      401,
      "unauthorized",
      "Invalid session, please sign in.",
      undefined
    );
  }

  // Parse Body
  let body;
  try {
    body = await req.formData();
  } catch (_error) {
    return createResponse(
      400,
      "bad_request",
      "Invalid request, expected a body: FormData",
      undefined
    );
  }

  // Get Image
  const image = body.get("image") as File;

  if (!image) {
    return createResponse(
      400,
      "bad_request",
      "No image is provided",
      undefined
    );
  }

  // Check MIME Type
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(image.type)) {
    return createResponse(
      400,
      "bad_request",
      `Only ${ALLOWED_IMAGE_MIME_TYPES.join(" - ")} are allowed`,
      undefined
    );
  }

  // Check MIME Size
  if (image.size > ALLOWED_IMAGE_MAX_MIME_SIZE) {
    return createResponse(
      400,
      "bad_request",
      `File is over size limit, maximum size is ${Math.floor(ALLOWED_IMAGE_MAX_MIME_SIZE / 1024 / 1024)}MB`,
      undefined
    );
  }

  // Extract Metadata
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let metadata: Metadata;
  try {
    metadata = await sharp(buffer).metadata();
  } catch (_error) {
    return createResponse(400, "bad_request", "Invalid image file", undefined);
  }

  // Convert image to webp if it's not a webp yet
  let processedBuffer: Buffer<ArrayBuffer | ArrayBufferLike> = buffer;
  if (metadata.format !== "webp") {
    processedBuffer = await sharp(buffer)
      .toFormat("webp", { quality: 80 })
      .toBuffer();
  }

  // Executions
  try {
    const response = await db.transaction(async (tx) => {
      // 1. Validate User Profiles
      let profile: Profile | undefined;
      try {
        profile = await tx.query.profiles.findFirst({
          where: eq(profiles.userId, user.id),
        });
      } catch (_error) {
        throw new OperationError(
          "database_error",
          "Failed when fetching user's profile"
        );
      }

      if (!profile) {
        throw new OperationError("not_found", "Profile is not exist");
      }

      // 2. Check if user's avatar is hosted on bucket server, if so delete first
      const currentAvatar = profile.avatar;

      if (currentAvatar && currentAvatar.includes(VERCEL_BLOB_ID)) {
        try {
          await del(currentAvatar);
        } catch (_error) {
          throw new OperationError(
            "bucket_error",
            "Failed when deleting user's old avatar, operation is aborted."
          );
        }
      }

      // 3. Upload New Avatar
      let putResult: PutBlobResult;
      try {
        putResult = await put(
          `tusktask/avatars/avatar_${user.id}_${Date.now()}.webp`,
          processedBuffer,
          {
            access: "public",
          }
        );
      } catch (_error) {
        throw new OperationError(
          "bucket_error",
          "Failed when uploading new user's old avatar, operation is aborted"
        );
      }

      const newAvatar = putResult.url;

      // 4. Set New Avatar
      let newData: Profile;
      try {
        [newData] = await tx
          .update(profiles)
          .set({ avatar: newAvatar })
          .where(eq(profiles.userId, user.id))
          .returning();
      } catch (_error) {
        throw new OperationError(
          "database_error",
          "Failed when updating user's avatar"
        );
      }

      return newData;
    });

    return createResponse(
      200,
      "success_update_avatar",
      "New avatar is uploaded and stored",
      response
    );
  } catch (error) {
    const isOE = error instanceof OperationError;
    return createResponse(
      500,
      isOE ? error.code : "unknown_error",
      isOE ? error.message : "Unknown Error",
      undefined
    );
  }
}
