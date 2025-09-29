"use client";

import { useMutateUserMetadata } from "@/src/lib/hooks/mutations/useMutateUserMetadata";
import { useMutateUserProfile } from "@/src/lib/hooks/mutations/useMutateUserProfile";
import { useOnboardingStore } from "@/src/lib/stores/page/onboardingStore";
import { nameSchema } from "@/src/lib/zod/schemas/authSchema";
import Input from "@/src/ui/components/Inputs/Input";
import StaticAlert from "@/src/ui/components/StaticAlert";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const NamePhase = () => {
  // Pull states from onboarding store
  const { userMetadata } = useOnboardingStore();

  // Form
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(
      z.object({
        name: nameSchema,
      })
    ),
    mode: "onChange",
    defaultValues: {
      name: userMetadata?.name ?? "",
    },
  });

  // Mutate Profile
  const { mutate: mutateProfile, isPending: isMutatingProfile } =
    useMutateUserProfile();

  // Mutate User Metadata
  const { mutate: mutateUserMetadata, isPending: isMutatatingUserMetadata } =
    useMutateUserMetadata();

  return (
    <div>
      <form
        className="space-y-4"
        suppressHydrationWarning
        onSubmit={handleSubmit((data) => {
          if (!isValid) return;

          mutateProfile(
            {
              newValues: { ...data },
            },
            {
              onSuccess: () => {
                mutateUserMetadata({ registration_phase: "username" });
                toast(`Changes Saved`, {
                  description: `Changed your name to ${data.name}`,
                });
              },
            }
          );
        })}
      >
        {/* Alert */}
        {userMetadata?.name && (
          <StaticAlert
            title="Where's The Name Come From?"
            body={
              "This default value is provided by your sign in provider like Discord, Google or Github"
            }
          />
        )}

        <Input control={control} name="name" placeholder="Display Name" />
        <Button
          className="w-full"
          disabled={!isValid || isMutatingProfile || isMutatatingUserMetadata}
        >
          Continue
        </Button>
      </form>
    </div>
  );
};

export default NamePhase;
