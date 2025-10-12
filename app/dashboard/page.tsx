import type { Metadata } from "next";
import { generateMetadata } from "@/src/lib/utils/generateMetadata";
import Header from "@/src/ui/components/Dashboard/Header";
import OngoingTasks from "./sections/OngoingTasks";
import Projects from "./sections/Projects";

export const metadata: Metadata = generateMetadata({
  title: "Dashboard",
});

const DashboardPage = () => {
  return (
    <div className="dashboard-padding">
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
