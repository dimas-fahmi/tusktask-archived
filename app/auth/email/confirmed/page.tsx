import { VERCEL_BLOB_HOST } from "@/src/lib/configs";
import { generateMetadata } from "@/src/lib/utils/generateMetadata";
import NavLink from "@/src/ui/components/NavLink";
import Discord from "@/src/ui/components/SVG/Logos/Discord";
import Github from "@/src/ui/components/SVG/Logos/Github";
import Google from "@/src/ui/components/SVG/Logos/Google";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { CircleCheck } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = generateMetadata({
  title: "Email Confirmed | TuskTask",
});

const EmailConfirmedPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ email: string; code: string }>;
}) => {
  const { email, code } = await searchParams;

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
        <h1 className="font-header font-bold text-2xl mb-2">Email Confirmed</h1>
        <p className="text-sm">
          Thank you for your co-operation, you can sign in now to finish your
          registration.
        </p>
      </header>

      {/* Email Container */}
      <div className="bg-positive/10 text-positive mt-4 p-4 rounded-md text-sm flex justify-between items-center">
        {/* Email */}
        <span>{email}</span>
        {/* Icon */}
        <CircleCheck />
      </div>

      {/* Login button */}
      <Button className="w-full block text-center mt-6" asChild>
        <Link href={code ? `/auth/callback?code=${code}` : "/auth"}>
          Sign In
        </Link>
      </Button>

      {/* Helper Bar */}
      <div className="mt-4 text-sm font-light flex items-center justify-between">
        <span>Or Continue With</span>
        <NavLink href="/auth/register">Sign Up</NavLink>
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

export default EmailConfirmedPage;
