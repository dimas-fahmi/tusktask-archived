"use client";

import { DEFAULT_EMAIL_COOLDOWN, VERCEL_BLOB_HOST } from "@/src/lib/configs";
import { useResendOtp } from "@/src/lib/hooks/mutations/useResendOtp";
import { useFetchEmailStatus } from "@/src/lib/hooks/queries/useFetchEmailStatus";
import { StandardizeResponse } from "@/src/lib/utils/createResponse";
import { formatTime } from "@/src/lib/utils/formatTime";
import { emailSchema } from "@/src/lib/zod/schemas/authSchema";
import Input from "@/src/ui/components/Inputs/Input";
import NavLink from "@/src/ui/components/NavLink";
import AuthAlert from "@/src/ui/components/Prefabs/AuthAlert";
import Discord from "@/src/ui/components/SVG/Logos/Discord";
import Github from "@/src/ui/components/SVG/Logos/Github";
import Google from "@/src/ui/components/SVG/Logos/Google";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const EmailConfirmationPageIndex = ({
  paramsEmail,
}: {
  paramsEmail: string;
}) => {
  // Router
  const router = useRouter();

  // Form
  const {
    control,
    watch,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(z.object({ email: emailSchema })),
    mode: "onChange",
    defaultValues: {
      email: paramsEmail ?? "",
    },
  });

  // Watch
  const email = watch("email");

  // Debouncer
  const [isTyping, setIsTyping] = useState(false);
  const [emailKey, setEmailKey] = useState("");

  useEffect(() => {
    setIsTyping(true);

    const debouncer = setTimeout(() => {
      setEmailKey(email);
      setIsTyping(false);
    }, 1000);

    return () => clearTimeout(debouncer);
  }, [email, setEmailKey, setIsTyping]);

  // Query
  const { data, isFetching, isFetched, refetch } =
    useFetchEmailStatus(emailKey);
  const emailStatus = data?.result;
  const alreadyConfirmed = emailStatus?.email_confirmed_at ? true : false;

  // Force Redirect to /auth if already confirmed
  if (alreadyConfirmed) {
    router.replace("/auth");
  }

  const isNotExist =
    !emailStatus && emailKey && isValid && isFetched ? true : false;

  // Timestamp
  const present = new Date();
  const confirmationSentAt = emailStatus?.confirmation_sent_at
    ? new Date(emailStatus?.confirmation_sent_at)
    : null;

  // Cooldown Mechanism
  const [timeLeft, setTimeLeft] = useState(0);
  let isCooldownPassed = true;

  useEffect(() => {
    if (confirmationSentAt) {
      const diff = present.getTime() - confirmationSentAt.getTime();
      isCooldownPassed = diff >= DEFAULT_EMAIL_COOLDOWN;

      if (!isCooldownPassed) {
        const d = DEFAULT_EMAIL_COOLDOWN - diff;
        setTimeLeft(d);
      } else {
        setTimeLeft(0);
      }
    }
  }, [data, setTimeLeft]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Execution
  const { mutate, isPending } = useResendOtp();

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
        <h1 className="font-header font-bold text-2xl mb-2">
          Email Confirmation
        </h1>
        <p className="text-sm">
          {`This action is intended to prevent you from being locked out of your account.`}
        </p>
      </header>

      {/* Auth Alert */}
      <AuthAlert className="mt-6" />

      <form
        className="mt-6 space-y-4"
        onSubmit={handleSubmit((data) => {
          if (!isValid) return;

          mutate(
            { email: data.email, type: "signup" },
            {
              onError: (error) => {
                const err = error as unknown as StandardizeResponse<unknown>;
                const code = err?.code ?? "unknown_error";
                const message = err?.message ?? "Unknown error";
                router.push(
                  `/auth/email/confirmation?code=${code}&message=${encodeURIComponent(message)}`
                );
              },
              onSettled: () => {
                refetch();
              },
            }
          );
        })}
      >
        {/* Email */}
        <Input
          icon={Mail}
          control={control}
          name="email"
          aria-placeholder="Email"
          placeholder="Email"
        />

        {/* Login button */}
        <Button
          disabled={
            !isValid ||
            isFetching ||
            timeLeft > 0 ||
            isTyping ||
            alreadyConfirmed ||
            isNotExist
          }
          className="w-full flex items-center"
        >
          {isFetching || isPending ? (
            <>
              <LoaderCircle className="animate-spin" />{" "}
              <span className="mt-1">
                {isPending ? "Processing" : "Searching"}
              </span>
            </>
          ) : alreadyConfirmed || isNotExist ? (
            "Invalid, not on the list"
          ) : timeLeft > 0 ? (
            <>
              <span>Wait</span>
              <span>{formatTime(timeLeft)}</span>
            </>
          ) : (
            <>Send Email Confirmation</>
          )}
        </Button>
      </form>

      {/* Helper Bar */}
      <div className="mt-4 text-sm font-light flex items-center justify-between">
        <span>Or Continue With</span>
        <NavLink href="/auth">Sign In</NavLink>
      </div>

      {/* OAuth Method */}
      <div className="grid grid-cols-3 mt-6 gap-3">
        <Button variant={"outline"}>
          <Google />
        </Button>
        <Button variant={"outline"}>
          <Github />
        </Button>
        <Button variant={"outline"}>
          <Discord />
        </Button>
      </div>

      {/* Policy */}
      <footer className="mt-6 text-xs">
        By this you agree to our{" "}
        <NavLink href="/policy">privacy policy</NavLink>
      </footer>
    </div>
  );
};

export default EmailConfirmationPageIndex;
