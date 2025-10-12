import type { Metadata } from "next";
import { generateMetadata } from "@/src/lib/utils/generateMetadata";
import RecoveryPageIndex from "./RecoveryPageIndex";

export const metadata: Metadata = generateMetadata({
  title: "Account Recovery",
});

const RecoveryPage = () => {
  return <RecoveryPageIndex />;
};

export default RecoveryPage;
