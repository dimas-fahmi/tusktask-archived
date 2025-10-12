import type { Metadata } from "next";
import { generateMetadata } from "@/src/lib/utils/generateMetadata";
import AuthPageIndex from "./AuthPageIndex";

export const metadata: Metadata = generateMetadata({
  title: "Continue To TuskTask",
});

const AuthPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ code: string }>;
}) => {
  const { code } = await searchParams;

  return <AuthPageIndex code={code} />;
};

export default AuthPage;
