"use client";

import { VERCEL_BLOB_HOST } from "@/src/lib/configs";
import { useSignUp } from "@/src/lib/hooks/auth/useAuth";
import { registrationSchema } from "@/src/lib/zod/schemas/authSchema";
import Input from "@/src/ui/components/Inputs/Input";
import NavLink from "@/src/ui/components/NavLink";
import Discord from "@/src/ui/components/SVG/Logos/Discord";
import Github from "@/src/ui/components/SVG/Logos/Github";
import Google from "@/src/ui/components/SVG/Logos/Google";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const RegisterPageIndex = () => {
  // Loading State
  const [loading, setLoading] = useState(false);

  // Form
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  // Action
  const { mutate: signUp } = useSignUp();

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
          Register New Account
        </h1>
        <p className="text-sm">
          Help you to finish your task, get organize and remind you of
          deadlines. For free!
        </p>
      </header>

      <form
        className="mt-6 space-y-4"
        onSubmit={handleSubmit((data) => {
          if (!isValid) return;

          // Trigger Loading
          setLoading(true);

          // Execute
          signUp(data, {
            onSettled: () => setLoading(false),
          });
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

        {/* Password */}
        <Input
          icon={Lock}
          control={control}
          name="password"
          placeholder="Password"
          type="password"
        />

        {/* Password Confirmation */}
        <Input
          icon={Lock}
          control={control}
          name="passwordConfirmation"
          placeholder="Password Confirmation"
          type="password"
        />

        {/* Login button */}
        <Button disabled={!isValid || loading} className="w-full">
          {loading ? <>Processing</> : <>Sign Up</>}
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

export default RegisterPageIndex;
