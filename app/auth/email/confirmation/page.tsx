import { generateMetadata } from "@/src/lib/utils/generateMetadata";
import type { Metadata } from "next";
import React from "react";
import EmailConfirmationPageIndex from "./EmailConfirmationPageIndex";

export const metadata: Metadata = generateMetadata({
  title: "Email Confirmation",
});

const EmailConfirmationPage = () => {
  return <EmailConfirmationPageIndex />;
};

export default EmailConfirmationPage;
