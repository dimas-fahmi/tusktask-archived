"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/src/ui/shadcn/components/ui/sidebar";
import { cn } from "@/src/ui/shadcn/lib/utils";
import ProfileCard from "../../ProfileCard";
import DsController from "./DsController";
import { navigations } from "./DsNavigations";

const DsNavLink = ({
  title,
  icon,
  href,
  className,
}: {
  title: string;
  icon: LucideIcon;
  href: string;
  className?: string;
}) => {
  // Pathname
  const pathname = usePathname();

  // Conditions
  const isActive = pathname === href;

  // Render Icon
  const Icon = icon;

  // Setter for mobile
  const { setOpenMobile } = useSidebar();

  return (
    <Link
      href={href}
      className={cn(
        `${isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-secondary-foreground"} font-body py-1 rounded-md flex px-4 gap-2 items-center`,
        className,
      )}
      onClick={() => {
        setOpenMobile(false);
      }}
    >
      {/* Icon */}
      <Icon className="w-4.5 h-4.5" />

      <span>{title}</span>
    </Link>
  );
};

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className="py-4 px-1 bg-sidebar">
      <SidebarHeader>
        {/* Profile Card */}
        <ProfileCard />

        {/* Sidebar Controller */}
        <DsController />
      </SidebarHeader>
      <SidebarContent className="px-2 mt-6">
        {navigations.map((item) => (
          <DsNavLink
            key={item.href}
            title={item.title}
            href={item.href}
            icon={item.icon}
          />
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
