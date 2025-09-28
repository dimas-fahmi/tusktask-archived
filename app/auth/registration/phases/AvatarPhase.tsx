"use client";

import {
  ALLOWED_MEME_SIZE,
  ALLOWED_MEME_TYPES,
  DEFAULT_AVATARS,
} from "@/src/lib/configs";
import { useOnboardingStore } from "@/src/lib/stores/page/onboardingStore";
import { detectURLType } from "@/src/lib/utils/detectURLType";
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

  // Preview State
  const [preview, setPreview] = useState(() => {
    return (
      userMetadata?.avatar_url ??
      DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)]
    );
  });

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
      if (!ALLOWED_MEME_TYPES.includes(file.type)) {
        setError({
          error: true,
          title: "Invalid File Type",
          description: "Only images allowed: JPG, PNG, WEBP",
        });

        e.target.value = "";
        return;
      }

      // Validate MEME Size
      if (file.size > ALLOWED_MEME_SIZE) {
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
      setPreview(url);
    }

    e.target.value = "";
  };

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
              : "You can bypass this step; a random avatar will be assigned to you, or you can upload your own avatar."}
          </p>

          <div className="mt-4 grid grid-cols-1">
            <Button
              variant={"outline"}
              onClick={() => {
                // TRY ERROR
                setError({
                  error: true,
                  title: "Over Size Limit",
                  description:
                    "File is over size limit, can't be more than 5MB",
                });
              }}
            >
              Continue
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
          Or pick this beatifull arts below
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
              onClick={() => setPreview(item)}
            />
          ))}
        </div>
      </div>

      {/* Hidden Input */}
      <input
        type="file"
        accept={ALLOWED_MEME_TYPES.join(",")}
        className="hidden"
        onChange={(e) => handleInputChange(e)}
        ref={hiddenInputRef}
      />
    </div>
  );
};

export default AvatarPhase;
