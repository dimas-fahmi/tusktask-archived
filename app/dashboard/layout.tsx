import NewTaskDialog from "@/src/ui/components/Dashboard/Dialogs/NewTaskDialog";
import NewProjectDrawer from "@/src/ui/components/Dashboard/Drawers/NewProjectDrawer";
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
        <SidebarInset className="w-full overflow-hidden">
          <DashboardNavbar />
          <div className="w-full overflow-hidden">{children}</div>
        </SidebarInset>

        {/* Drawers */}
        <NewProjectDrawer />

        {/* Dialogs */}
        <NewTaskDialog />
      </SidebarProvider>
    </>
  );
};

export default DashboardLayout;
