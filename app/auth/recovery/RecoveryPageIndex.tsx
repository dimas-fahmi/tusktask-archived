"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DEFAULT_EMAIL_COOLDOWN, VERCEL_BLOB_HOST } from "@/src/lib/configs";
import { useResendOtp } from "@/src/lib/hooks/mutations/useResendOtp";
import { useFetchEmailStatus } from "@/src/lib/hooks/queries/useFetchEmailStatus";
import type { AuthResponse } from "@/src/lib/supabase/auth/actions";
import { formatTime } from "@/src/lib/utils/formatTime";
import { emailSchema } from "@/src/lib/zod/schemas/authSchema";
import Input from "@/src/ui/components/Inputs/Input";
import NavLink from "@/src/ui/components/NavLink";
import Discord from "@/src/ui/components/SVG/Logos/Discord";
import Github from "@/src/ui/components/SVG/Logos/Github";
import Google from "@/src/ui/components/SVG/Logos/Google";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const RecoveryPageIndex = () => {
  // Router initialization
  const router = useRouter();

  // Form
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(z.object({ email: emailSchema })),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  // Watch Email
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
  }, [email]);

  // Fetch EmailStatus
  const { data, isFetching, refetch } = useFetchEmailStatus(emailKey);

  // Process data
  const emailStatus = data?.result;

  // Countdown mechanism
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!emailStatus) {
      setTimeLeft(0);
      return;
    }

    const present = new Date();
    const recoverySentAt = emailStatus?.recovery_sent_at
      ? new Date(emailStatus.recovery_sent_at)
      : null;

    if (recoverySentAt) {
      const diff = present.getTime() - recoverySentAt.getTime();
      setTimeLeft(DEFAULT_EMAIL_COOLDOWN - diff);
    }
  }, [emailStatus]);

  useEffect(() => {
    if (timeLeft < 1) return;

    const countdown = setTimeout(() => {
      setTimeLeft((prev) => prev - 1000);
    }, 1000);

    return () => clearTimeout(countdown);
  }, [timeLeft]);

  // Mutation
  const { mutate: send, isPending: isSending } = useResendOtp();
  return (
    <div>
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
            Account Recovery
          </h1>
          <p className="text-sm">
            {`Forgot your password? No problem, it happens to everyone! We'll shoot you an email with steps to reset your password.`}
          </p>
        </header>

        <form
          className="mt-6 space-y-4"
          onSubmit={handleSubmit((data) => {
            if (!data?.email || !isValid) return;

            send(
              {
                email: data.email,
                type: "reset_password",
              },
              {
                onError: (error) => {
                  router.push(
                    `/auth/recovery/reset?code=${(error as unknown as AuthResponse)?.code ?? "unknown_error"}&message=${encodeURIComponent((error as unknown as AuthResponse)?.message ?? "Unknown error")}`,
                  );
                },
                onSettled: () => {
                  refetch();
                },
              },
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
              !isValid || isTyping || timeLeft > 0 || isFetching || isSending
            }
            className="w-full"
          >
            {timeLeft > 0 ? (
              <>Wait {formatTime(timeLeft)}</>
            ) : isFetching ? (
              <>Searching</>
            ) : (
              <>Send Recovery Instructions</>
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
    </div>
  );
};

export default RecoveryPageIndex;
