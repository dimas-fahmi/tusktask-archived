"use client";

import {
  ALLOWED_IMAGE_MAX_MIME_SIZE,
  ALLOWED_IMAGE_MIME_TYPES,
  DEFAULT_AVATARS,
} from "@/src/lib/configs";
import { useMutateUserAvatar } from "@/src/lib/hooks/mutations/useMutateUserAvatar";
import { useMutateUserMetadata } from "@/src/lib/hooks/mutations/useMutateUserMetadata";
import { useMutateUserProfile } from "@/src/lib/hooks/mutations/useMutateUserProfile";
import { useOnboardingStore } from "@/src/lib/stores/page/onboardingStore";
import { useCropperStore } from "@/src/lib/stores/ui/cropperStore";
import { detectURLType } from "@/src/lib/utils/detectURLType";
import { formatFileSize } from "@/src/lib/utils/formatFileSize";
import ImageCropper from "@/src/ui/components/Cropper";
import StaticAlert from "@/src/ui/components/StaticAlert";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { Camera, XIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export interface AvatarPhaseErrorState {
  error: boolean;
  title?: string;
  description?: string;
}

const defaultAvatarPhaseErrorSate: AvatarPhaseErrorState = {
  error: false,
  title: undefined,
  description: undefined,
};

const AvatarPhase = () => {
  // Pull state from onboarding store
  const { userMetadata } = useOnboardingStore();

  // Cropper States
  const { setCroppingImage, setFile, preview, setPreview, file } =
    useCropperStore();

  // PreviewHTTPURL
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Revoke objectURL
  const previousPreviewRef = useRef<string | null>(null);
  useEffect(() => {
    const previousPreview = previousPreviewRef?.current;

    if (previousPreview) {
      const urlType = detectURLType(previousPreview);

      if (urlType === "ObjectURL") {
        URL.revokeObjectURL(previousPreview);
      }
    }

    previousPreviewRef.current = preview;
  }, [preview]);

  useEffect(() => {
    if (userMetadata?.avatar_url) {
      setPreview(userMetadata.avatar_url);
      setPreviewURL(userMetadata.avatar_url);
    }
  }, [userMetadata, setPreview, setPreviewURL]);

  // Error State
  const [error, setError] = useState<AvatarPhaseErrorState>(
    defaultAvatarPhaseErrorSate
  );

  // Hidden Input Ref
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate MEME Types
      if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
        setError({
          error: true,
          title: "Invalid File Type",
          description: "Only images allowed: JPG, PNG, WEBP",
        });

        e.target.value = "";
        return;
      }

      // Validate MEME Size
      if (file.size > ALLOWED_IMAGE_MAX_MIME_SIZE) {
        setError({
          error: true,
          title: "Over Size Limit",
          description: "File is over size limit, can't be more than 5MB",
        });

        e.target.value = "";
        return;
      }

      setError(defaultAvatarPhaseErrorSate);
      const url = URL.createObjectURL(file);
      setFile(file);
      setCroppingImage(url);
    }

    e.target.value = "";
  };

  // Mutate User Avatar
  const { mutate: mutateUserAvatar, isPending: isMutatingUserAvatar } =
    useMutateUserAvatar();

  // Mutate User Profile
  const { mutate: mutateUserProfile, isPending: isMutatingUserProfile } =
    useMutateUserProfile();

  // Mutate User Metadata
  const { mutate: mutateUserMetadata, isPending: isMutatingUserMetadata } =
    useMutateUserMetadata();

  return (
    <div>
      {/* Controller */}
      <div className="flex gap-4 items-center">
        {/* Preview container */}
        <div className="relative flex items-center h-full">
          <Image
            width={300}
            height={300}
            src={preview}
            alt="n"
            className="min-w-24 min-h-24 md:min-w-28 max-w-24 max-h-24 md:min-h-28 md:max-w-28 md:max-h-28 rounded-full object-cover"
            loading={"eager"}
          />

          {/* Upload button */}
          <Button
            variant={"outline"}
            className="absolute bottom-0 right-0 rounded-full w-12 h-12"
            onClick={() => {
              if (hiddenInputRef?.current) {
                hiddenInputRef.current.click();
              }
            }}
          >
            <Camera />
          </Button>
        </div>

        {/* Upload Button */}
        <div>
          <h2 className="font-header text-lg">Upload or Skip</h2>
          <p className="text-xs">
            {userMetadata?.avatar_url
              ? "You can choose to retain this avatar, or you can choose to upload a new one."
              : "You can bypass this step; by picking default art below, or you can upload your own avatar."}
          </p>

          <div className="mt-4 grid grid-cols-1">
            {file && file.size && (
              <div className="mb-1.5 text-xs">
                Compressed file size : {formatFileSize(file?.size)}
              </div>
            )}
            <Button
              variant={file ? "default" : "outline"}
              onClick={() => {
                if (file) {
                  mutateUserAvatar(file, {
                    onSuccess: () => {
                      mutateUserMetadata({
                        registration_phase: "confirmation",
                      });
                    },
                  });
                  return;
                }

                if (previewURL) {
                  mutateUserProfile(
                    {
                      newValues: {
                        avatar: previewURL,
                      },
                    },
                    {
                      onSuccess: () => {
                        mutateUserMetadata({
                          registration_phase: "confirmation",
                        });
                      },
                    }
                  );
                  return;
                }
              }}
              disabled={
                isMutatingUserAvatar ||
                isMutatingUserProfile ||
                isMutatingUserMetadata ||
                (!previewURL && !file)
              }
            >
              {file ? "Upload" : "Continue"}
            </Button>
          </div>
        </div>
      </div>

      {/* Error Component */}
      {error?.error && (
        <StaticAlert
          title={error.title ?? ""}
          body={error?.description ?? ""}
          classes={{ container: "mt-4" }}
          variant={"destructive"}
          onClose={() => setError(defaultAvatarPhaseErrorSate)}
          closeIcon={XIcon}
        />
      )}

      {/* Defaults container */}
      <div className="mt-4">
        <h2 className="font-header text-lg">
          {userMetadata?.avatar_url
            ? " Or pick this beatifull arts below"
            : "Pick this beautifull arts below"}
        </h2>
        <div className="grid grid-cols-4 pb-4 mt-2 gap-4 scrollbar-none">
          {DEFAULT_AVATARS.map((item) => (
            <Image
              width={120}
              height={120}
              src={item}
              alt="Default avatars"
              key={item}
              className="rounded-full min-w-18 max-w-18 min-h-18 max-h-18 md:min-w-24 md:min-h-24 md:max-w-24 md:max-h-24 drag-none select-none cursor-pointer active:scale-95 transition-all duration-300 shadow-xl"
              loading="eager"
              onClick={() => {
                setPreviewURL(item);
                setPreview(item);
                setFile(null);
              }}
            />
          ))}
        </div>
      </div>

      {/* Hidden Input */}
      <input
        type="file"
        accept={ALLOWED_IMAGE_MIME_TYPES.join(",")}
        className="hidden"
        onChange={(e) => handleInputChange(e)}
        ref={hiddenInputRef}
      />

      {/* Cropper Modal */}
      <ImageCropper
        aspect={1 / 1}
        loading={loading}
        setLoading={setLoading}
        compressionOptions={{
          compressionOptions: {
            maxSizeMB: 0.1,
            maxWidthOrHeight: 512,
          },
        }}
      />
    </div>
  );
};

export default AvatarPhase;
