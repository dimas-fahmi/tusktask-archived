import { generateMetadata } from "@/src/lib/utils/generateMetadata";
import Header from "@/src/ui/components/Dashboard/Header";
import { Metadata } from "next";
import React from "react";
import Projects from "./sections/Projects";
import OngoingTasks from "./sections/OngoingTasks";

export const metadata: Metadata = generateMetadata({
  title: "Dashboard",
});

const DashboardPage = () => {
  return (
    <div className="">
      {/* Header */}
      <Header />

      {/* Projects Section */}
      <Projects />

      {/* Tasks Section */}
      <OngoingTasks />
    </div>
  );
};

export default DashboardPage;
