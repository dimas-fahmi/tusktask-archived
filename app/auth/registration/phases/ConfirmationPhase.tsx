import { DEFAULT_NO_IMAGE_SQUARE } from "@/src/lib/configs";
import { useSession } from "@/src/lib/hooks/auth/useAuth";
import { useMutateUserMetadata } from "@/src/lib/hooks/mutations/useMutateUserMetadata";
import { useFetchProfile } from "@/src/lib/hooks/queries/useFetchProfile";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { Skeleton } from "@/src/ui/shadcn/components/ui/skeleton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const ConfirmationPhase = () => {
  // Pull Session
  const { data: session } = useSession();

  // Pull User's profile
  const { data: profile } = useFetchProfile(
    { id: session?.user?.id },
    session?.user?.id ? true : false
  );

  // Mutate Metadata
  const router = useRouter();
  const { mutate: mutateUserMetadata, isPending: isMutatingUserMetadata } =
    useMutateUserMetadata();

  return (
    <div className="p-4">
      {profile?.avatar ? (
        // Membership Card
        <div className="bg-card p-4 rounded-md shadow-2xl card">
          {/* Avatar */}
          <Image
            width={80}
            height={80}
            loading="eager"
            src={profile?.avatar ?? DEFAULT_NO_IMAGE_SQUARE}
            alt={`${profile?.name ?? "User"}'s Avatar`}
            className="rounded-full w-20 h-20 drag-none block mx-auto"
          />

          {/* Information */}
          <div className="grid gap-4">
            <div className="text-center mt-4">
              <h1 className="font-header text-2xl font-bold leading-5">
                {profile?.name}
              </h1>
              <small className="text-xs">{profile?.username}</small>
            </div>
            <Button
              variant={"default"}
              disabled={isMutatingUserMetadata}
              onClick={() => {
                mutateUserMetadata(
                  {
                    registration_phase: "completed",
                  },
                  {
                    onSuccess: () => {
                      router.refresh();
                    },
                  }
                );
              }}
            >
              {isMutatingUserMetadata ? "Processing" : "Good Enough"}
            </Button>
          </div>
        </div>
      ) : (
        // Membership Card
        <Skeleton className="p-4 rounded-md shadow-2xl card">
          {/* Avatar */}
          <Skeleton className="rounded-full w-20 h-20 drag-none block mx-auto" />

          {/* Information */}
          <div className="grid gap-4">
            <div className="text-center mt-4">
              <Skeleton className="h-6 w-38 drag-none block mx-auto" />
              <Skeleton className="h-3 mt-1 w-24 drag-none block mx-auto" />
            </div>
            <Skeleton className="mt-1 w-48 h-8 drag-none block mx-auto" />
          </div>
        </Skeleton>
      )}
    </div>
  );
};

export default ConfirmationPhase;
