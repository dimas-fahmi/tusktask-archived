"use client";

import { VERCEL_BLOB_HOST } from "@/src/lib/configs";
import Input from "@/src/ui/components/Inputs/Input";
import NavLink from "@/src/ui/components/NavLink";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signInSchema } from "@/src/lib/zod/schemas/authSchema";
import { useOAuth, useSignIn } from "@/src/lib/hooks/auth/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthAlert from "@/src/ui/components/Prefabs/AuthAlert";
import OAuthBar from "@/src/ui/components/OAuthBar";

const AuthPageIndex = ({ code }: { code: string }) => {
  // Loading State
  const [loading, setLoading] = useState(false);

  // Form
  const {
    control,
    watch,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Watch
  const email = watch("email");

  // useAuth
  const { mutate: signIn } = useSignIn();
  const { mutate: _oAuth } = useOAuth();

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
          Continue To TuskTask
        </h1>
        <p className="text-sm">
          Help you to finish your task, get organize and remind you of
          deadlines. For free!
        </p>
      </header>
      {/* Alert */}
      <AuthAlert className="mt-6">
        {code === "email_not_confirmed" && (
          <Button
            variant={"outline"}
            className="bg-transparent hover:bg-transparent mt-4 w-full"
            asChild
          >
            <Link href={`/auth/email/confirmation?email=${email}`}>
              Confirm My Email
            </Link>
          </Button>
        )}
      </AuthAlert>
      {/* Form */}
      <form
        className="mt-6 space-y-4"
        onSubmit={handleSubmit((data) => {
          if (!isValid) return;

          // Trigger Loading
          setLoading(true);

          // Mutate
          signIn(data, {
            onSettled: () => {
              setLoading(false);
            },
          });
        })}
        suppressHydrationWarning
      >
        {/* Email */}
        <Input
          icon={Mail}
          control={control}
          name="email"
          aria-placeholder="Email"
          placeholder="Email"
        />

        {/* Password */}
        <Input
          icon={Lock}
          control={control}
          name="password"
          placeholder="Password"
          type="password"
        />

        {/* Login button */}
        <Button disabled={!isValid || loading} className="w-full">
          {loading ? <>Processing</> : <>Sign In</>}
        </Button>
      </form>
      {/* Helper Bar */}
      <div className="mt-4 text-sm font-light flex items-center justify-between">
        <span>Or Continue With</span>
        <NavLink href="/auth/register">Sign Up</NavLink>
      </div>
      {/* OAuth Method */}
      <OAuthBar />

      {/* Policy */}
      <footer className="mt-6 text-xs">
        By this you agree to our{" "}
        <NavLink href="/policy">privacy policy</NavLink>
      </footer>
    </div>
  );
};

export default AuthPageIndex;
