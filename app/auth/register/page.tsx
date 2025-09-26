import { generateMetadata } from "@/src/lib/utils/generateMetadata";
import type { Metadata } from "next";
import React from "react";
import RegisterPageIndex from "./RegisterPageIndex";

export const metadata: Metadata = generateMetadata({
  title: "Get TuskTask For Free",
});

const RegisterPage = () => {
  return <RegisterPageIndex />;
};

export default RegisterPage;
