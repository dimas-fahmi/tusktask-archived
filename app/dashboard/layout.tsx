"use client";

import type React from "react";
import { useThemeStore } from "@/src/lib/stores/ui/themeStore";
import NewTaskDialog from "@/src/ui/components/Dashboard/Dialogs/NewTaskDialog";
import RescheduleTaskDialog from "@/src/ui/components/Dashboard/Dialogs/RescheduleTaskDialog";
import ThemePickerDialog from "@/src/ui/components/Dashboard/Dialogs/ThemePickerDialog";
import NewProjectDrawer from "@/src/ui/components/Dashboard/Drawers/NewProjectDrawer";
import DashboardNavbar from "@/src/ui/components/Dashboard/NavBar/DashboardNavbar";
import { DashboardSidebar } from "@/src/ui/components/Dashboard/Sidebar/DashboardSidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/src/ui/shadcn/components/ui/sidebar";

const DashboardLayout = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  const { activeTheme, activeFont } = useThemeStore();

  return (
    <div
      className={`${activeTheme.id} ${activeFont.id} bg-background text-foreground`}
    >
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
        <RescheduleTaskDialog />
        <ThemePickerDialog />
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
