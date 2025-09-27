"use client";

import { VERCEL_BLOB_HOST } from "@/src/lib/configs";
import { createBrowserClient } from "@/src/lib/supabase/instances/client";
import { passwordResetSchema } from "@/src/lib/zod/schemas/authSchema";
import Input from "@/src/ui/components/Inputs/Input";
import NavLink from "@/src/ui/components/NavLink";
import AuthAlert from "@/src/ui/components/Prefabs/AuthAlert";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { AuthError } from "@supabase/supabase-js";
import { formatTime } from "@/src/lib/utils/formatTime";
import { useSignOut } from "@/src/lib/hooks/auth/useAuth";

const ResetPageIndex = () => {
  // Session
  const supabase = createBrowserClient();

  // Initialize Router
  const router = useRouter();

  // Window time and countdown
  const [windowEndTime, setWindowEndTime] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    supabase.auth.refreshSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const resetWindow = session?.user?.app_metadata?.reset_password_window;

        if (!resetWindow) {
          router.push("/auth");
          return;
        }

        const windowEndTime = new Date(resetWindow).getTime();
        setWindowEndTime(windowEndTime);
      } else {
        router.push("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const { mutate: signOut } = useSignOut();

  // Countdown timer
  useEffect(() => {
    if (!windowEndTime) return;

    const updateCountdown = () => {
      const now = Date.now();
      const remaining = Math.max(0, windowEndTime - now);
      setTimeLeft(remaining);

      // If time expired, redirect
      if (remaining === 0) {
        router.push("/auth?message=Password reset window has expired");
        signOut();
      }
    };

    // Update immediately
    updateCountdown();

    // Set up interval
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [windowEndTime, router, signOut]);

  // Form
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(passwordResetSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  // Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      password,
      passwordConfirmation,
    }: {
      password: string;
      passwordConfirmation: string;
    }) => {
      const response = await fetch("/api/users/password", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ password, passwordConfirmation }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw result;
      }

      return result;
    },
    onError: (error) => {
      const authError = error as AuthError;
      router.push(
        `/auth/recovery/reset?code=${authError?.code ?? "unknown_error"}&message=${encodeURIComponent(authError?.message ?? "Unknown error")}`
      );
    },
    onSuccess: () => {
      signOut();
      router.push(
        "/auth?code=success_reset_password&message=Password has been reset successfully"
      );
    },
  });

  const isExpired = timeLeft === 0;

  return (
    <div className="max-w-md p-4">
      {/* Logo */}
      <Link href={"/"}>
        <Image
          width={250}
          height={250}
          src={`${VERCEL_BLOB_HOST}/logo/tusktask.png`}
          alt="TuskTask Logo Symbolic"
          className="w-16 h-16 block"
        />
      </Link>

      {/* Header */}
      <header className="mt-4">
        <h1 className="font-header font-bold text-2xl mb-2">Reset Password</h1>
        <p className="text-sm">
          Follow best practice—at least 8 characters, but longer is better. Mix
          upper and lowercase letters, numbers, and special symbols to keep it
          secure.
        </p>
      </header>

      {/* Countdown */}
      {timeLeft > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            Time remaining:{" "}
            <span className="font-mono font-medium">
              {formatTime(timeLeft)}
            </span>
          </p>
        </div>
      )}

      {/* Expired Message */}
      {isExpired && (
        <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md">
          <p className="text-sm">
            Password reset window has expired. Please request a new reset link.
          </p>
        </div>
      )}

      {/* Auth Alert */}
      <Suspense>
        <AuthAlert className="mt-6" />
      </Suspense>

      <form
        className="mt-6 space-y-4"
        onSubmit={handleSubmit((data) => {
          mutate(data);
        })}
        suppressHydrationWarning
      >
        {/* New Password */}
        <Input
          icon={Lock}
          control={control}
          type="password"
          name="password"
          aria-placeholder="New Password"
          placeholder="New Password"
          disabled={isExpired}
        />

        {/* Password Confirmation */}
        <Input
          icon={Lock}
          control={control}
          type="password"
          name="passwordConfirmation"
          aria-placeholder="Repeat Password"
          placeholder="Repeat Password"
          disabled={isExpired}
        />

        {/* Submit button */}
        <Button
          type="submit"
          disabled={!isValid || isExpired || isPending}
          className="w-full flex items-center"
        >
          {isPending
            ? "Resetting..."
            : isExpired
              ? "Expired"
              : "Reset Password"}
        </Button>
      </form>

      {/* Helper Bar */}
      <div className="mt-4 text-sm font-light flex items-center justify-between">
        <NavLink href="/auth">Back To Sign In Page</NavLink>
        <NavLink href="/">Homepage</NavLink>
      </div>

      {/* Policy */}
      <footer className="mt-6 text-xs">
        By this you agree to our{" "}
        <NavLink href="/policy">privacy policy</NavLink>
      </footer>
    </div>
  );
};

export default ResetPageIndex;
