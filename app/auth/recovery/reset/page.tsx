import { generateMetadata } from "@/src/lib/utils/generateMetadata";
import { Metadata } from "next";
import React from "react";
import ResetPageIndex from "./ResetPageIndex";

export const metadata: Metadata = generateMetadata({
  title: "Account Recovery",
});

const ResetPage = () => {
  return <ResetPageIndex />;
};

export default ResetPage;
