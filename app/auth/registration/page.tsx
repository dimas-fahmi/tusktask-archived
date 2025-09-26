import { generateMetadata } from "@/src/lib/utils/generateMetadata";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = generateMetadata({
  title: "Registration Phase",
});

const RegistrationPage = () => {
  return <div>RegistrationPage</div>;
};

export default RegistrationPage;
