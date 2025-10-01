"use client";

import { useFetchUserProfile } from "@/src/lib/hooks/queries/useFetchUserProfile";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/ui/shadcn/components/ui/avatar";
import { useSidebar } from "@/src/ui/shadcn/components/ui/sidebar";
import { Bell, PanelLeft } from "lucide-react";
import React from "react";

const DashboardNavbar = () => {
  // User Profile
  const { data: profile } = useFetchUserProfile();

  // Pull states from useSidebar
  const { open, setOpen } = useSidebar();

  return (
    <div className="p-4 md:p-6 flex items-center justify-between">
      {/* Left Side */}
      <div>
        <button
          className="hidden md:block button-reactivity opacity-70"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <PanelLeft />
        </button>

        <div className="md:hidden">
          <h1 className="font-header text-xl">
            Hi {profile?.name?.split(" ")[0]}
          </h1>
          <span className="text-sm opacity-70">03 tasks pending</span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <button className="button-reactivity opacity-70">
          <Bell />
        </button>
        <button className="button-reactivity">
          <Avatar className="w-10 h-10">
            {profile?.avatar && <AvatarImage src={profile?.avatar} />}
            <AvatarFallback>DF</AvatarFallback>
          </Avatar>
        </button>
      </div>
    </div>
  );
};

export default DashboardNavbar;
