import type { Metadata } from "next";
import { generateMetadata } from "@/src/lib/utils/generateMetadata";
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
