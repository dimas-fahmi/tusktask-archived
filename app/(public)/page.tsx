import React from "react";
import type { Metadata } from "next";
import { generateMetadata } from "@/src/lib/utils/generateMetadata";

export const metadata: Metadata = generateMetadata();

export default function Home() {
  return <>Hello World</>;
}
