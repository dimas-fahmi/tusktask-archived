import type { Metadata } from "next";
import { generateMetadata } from "@/src/lib/utils/generateMetadata";
import ResetPageIndex from "./ResetPageIndex";

export const metadata: Metadata = generateMetadata({
  title: "Account Recovery",
});

const ResetPage = () => {
  return <ResetPageIndex />;
};

export default ResetPage;
