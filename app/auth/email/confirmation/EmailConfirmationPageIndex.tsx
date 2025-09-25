"use client";

import { VERCEL_BLOB_HOST } from "@/src/lib/configs";
import Input from "@/src/ui/components/Inputs/Input";
import NavLink from "@/src/ui/components/NavLink";
import Discord from "@/src/ui/components/SVG/Logos/Discord";
import Github from "@/src/ui/components/SVG/Logos/Github";
import Google from "@/src/ui/components/SVG/Logos/Google";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";

const EmailConfirmationPageIndex = () => {
  // Form
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

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

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(() => {})}>
        {/* Email */}
        <Input
          icon={Mail}
          control={control}
          name="email"
          aria-placeholder="Email"
          placeholder="Email"
        />

        {/* Login button */}
        <Button disabled={!isValid} className="w-full">
          Send Email Confirmation
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
