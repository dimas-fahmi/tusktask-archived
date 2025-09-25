import { generateMetadata } from "@/src/lib/utils/generateMetadata";
import { Metadata } from "next";
import React from "react";
import RecoveryPageIndex from "./RecoveryPageIndex";

export const metadata: Metadata = generateMetadata({
  title: "Account Recovery",
});

const RecoveryPage = () => {
  return <RecoveryPageIndex />;
};

export default RecoveryPage;
