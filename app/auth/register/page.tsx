import type { Metadata } from "next";
import { generateMetadata } from "@/src/lib/utils/generateMetadata";
import RegisterPageIndex from "./RegisterPageIndex";

export const metadata: Metadata = generateMetadata({
  title: "Get TuskTask For Free",
});

const RegisterPage = () => {
  return <RegisterPageIndex />;
};

export default RegisterPage;
