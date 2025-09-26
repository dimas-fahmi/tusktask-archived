import { generateMetadata } from "@/src/lib/utils/generateMetadata";
import type { Metadata } from "next";
import React from "react";
import EmailConfirmationPageIndex from "./EmailConfirmationPageIndex";

export const metadata: Metadata = generateMetadata({
  title: "Email Confirmation",
});

const EmailConfirmationPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ email: string }>;
}) => {
  const { email } = await searchParams;
  return <EmailConfirmationPageIndex paramsEmail={email} />;
};

export default EmailConfirmationPage;
