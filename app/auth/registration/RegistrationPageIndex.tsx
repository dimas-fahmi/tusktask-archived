"use client";

import { useSession, useSignOut } from "@/src/lib/hooks/auth/useAuth";
import { useOnboardingStore } from "@/src/lib/stores/page/onboardingStore";
import { UserMetadata } from "@/src/lib/types/supabase";
import AuthAlert from "@/src/ui/components/Prefabs/AuthAlert";
import React, { Suspense, useEffect } from "react";
import { renderer } from "./renderer";

const RegistrationPageIndex = () => {
  // Pull states from onboarding store
  const { title, subtitle, render, setter } = useOnboardingStore();

  // Session
  const {
    data: session,
    isFetching: isFetchingSession,
    refetch: refetchSession,
  } = useSession();

  // Syncronize data
  useEffect(() => {
    if (isFetchingSession) return;

    const user = session?.user;
    const userMetadata = user?.user_metadata as UserMetadata;

    // Set UserMetadata
    if (userMetadata) {
      setter({ userMetadata: userMetadata });
    }

    // Set registration phase
    if (userMetadata?.registration_phase) {
      setter({ registrationPhase: userMetadata.registration_phase });

      // Run Renderer
      renderer(setter, userMetadata.registration_phase);
    }
  }, [setter, session, isFetchingSession, refetchSession]);

  // SignOut
  const { mutate: signOut } = useSignOut();

  return (
    <div>
      {/* Header */}
      <header className="mt-4">
        <h1 className="font-header font-bold text-2xl mb-2">{title}</h1>
        <p className="text-sm">{subtitle}</p>
      </header>

      {/* Auth Alert */}
      <Suspense>
        <AuthAlert className="mt-6" />
      </Suspense>

      <div className="mt-6">{render}</div>

      {/* Helper Bar */}
      <div className="mt-4 text-sm font-light flex items-center justify-between">
        <span>{`It's not your account?`}</span>
        <button
          className="navlink"
          onClick={() => {
            signOut();
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default RegistrationPageIndex;
