"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useMutateUserMetadata } from "@/src/lib/hooks/mutations/useMutateUserMetadata";
import { useMutateUserProfile } from "@/src/lib/hooks/mutations/useMutateUserProfile";
import { useFetchProfile } from "@/src/lib/hooks/queries/useFetchProfile";
import { useOnboardingStore } from "@/src/lib/stores/page/onboardingStore";
import { usernameSchema } from "@/src/lib/zod/schemas/authSchema";
import Input from "@/src/ui/components/Inputs/Input";
import StaticAlert from "@/src/ui/components/StaticAlert";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const UsernamePhase = () => {
  // Pull states from onboarding store
  const { userMetadata } = useOnboardingStore();

  // Form
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(z.object({ username: usernameSchema })),
    mode: "onChange",
    defaultValues: {
      username: userMetadata?.preferred_username ?? "",
    },
  });

  // Listen to username
  const username = watch("username");

  // Debouncer
  const [isTyping, setIsTyping] = useState(false);
  const [usernameKey, setUsernameKey] = useState("");

  useEffect(() => {
    setIsTyping(true);

    const debouncer = setTimeout(() => {
      setUsernameKey(username);
      setIsTyping(false);
    }, 1000);

    return () => clearTimeout(debouncer);
  }, [username]);

  // Username availability mechanism
  const [available, setAvailable] = useState(false);

  const startFetching = usernameKey.length > 3 && isValid && !isTyping;

  const { data: profile, isFetching: isFetchingUsername } = useFetchProfile(
    {
      username: usernameKey,
    },
    startFetching,
  );

  useEffect(() => {
    if (profile) {
      setAvailable(false);
    } else {
      setAvailable(true);
    }
  }, [profile]);

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
                mutateUserMetadata({ registration_phase: "avatar" });
                toast(`Changes Saved`, {
                  description: `Changed your username to ${data.username}`,
                });
              },
            },
          );
        })}
      >
        {/* Alert */}
        {userMetadata?.preferred_username && (
          <StaticAlert
            title="Where's This Come From?"
            body={
              "This default value is provided by your sign in provider like Discord, Google or Github"
            }
          />
        )}

        <Input
          control={control}
          name="username"
          placeholder="Username"
          status={
            <>
              {/* IsTyping */}
              {isTyping ? (
                <p className="animate-pulse">Processing</p>
              ) : isFetchingUsername ? (
                <p className="animate-pulse">Checking username availability</p>
              ) : available && isValid ? (
                <p className="text-positive">Username available</p>
              ) : (
                isValid && (
                  <p className="text-destructive">Username is not available</p>
                )
              )}
            </>
          }
        />
        <Button
          className="w-full"
          disabled={
            !isValid ||
            isMutatingProfile ||
            isMutatatingUserMetadata ||
            !available ||
            isTyping ||
            isFetchingUsername
          }
        >
          Continue
        </Button>
      </form>
    </div>
  );
};

export default UsernamePhase;
