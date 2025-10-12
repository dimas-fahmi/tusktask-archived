import type { Metadata } from "next";
import { generateMetadata } from "@/src/lib/utils/generateMetadata";
import LandingPageIndex from "./LandingPageIndex";

export const metadata: Metadata = generateMetadata();

export default function LandingPage() {
  return <LandingPageIndex />;
}
