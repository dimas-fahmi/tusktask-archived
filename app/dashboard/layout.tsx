import DashboardNavbar from "@/src/ui/components/Dashboard/NavBar/DashboardNavbar";
import { DashboardSidebar } from "@/src/ui/components/Dashboard/Sidebar/DashboardSidebar";

import {
  SidebarInset,
  SidebarProvider,
} from "@/src/ui/shadcn/components/ui/sidebar";
import React from "react";

const DashboardLayout = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  return (
    <>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <DashboardNavbar />
          <div className="py-2 px-4 md:px-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default DashboardLayout;
