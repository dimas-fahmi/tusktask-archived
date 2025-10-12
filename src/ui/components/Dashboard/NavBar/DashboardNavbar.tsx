"use client";

import { Bell, PanelLeft, SwatchBook } from "lucide-react";
import { useFetchUserProfile } from "@/src/lib/hooks/queries/useFetchUserProfile";
import { useThemeStore } from "@/src/lib/stores/ui/themeStore";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/ui/shadcn/components/ui/avatar";
import { useSidebar } from "@/src/ui/shadcn/components/ui/sidebar";

const DashboardNavbar = () => {
  // User Profile
  const { data: profile } = useFetchUserProfile();

  // Pull states from useSidebar
  const { open, setOpen, openMobile, setOpenMobile } = useSidebar();

  // Pull states and setters from theme store
  const { setThemePickerDialogOpen } = useThemeStore();

  return (
    <div className="p-4 md:p-6 flex items-center justify-between">
      {/* Left Side */}
      <div>
        <button
          type="button"
          className="hidden md:block button-reactivity opacity-70"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <PanelLeft />
        </button>

        <div className="md:hidden flex gap-2">
          <button
            type="button"
            className="button-reactivity opacity-70 border px-2 rounded-md"
            onClick={() => {
              setOpenMobile(!openMobile);
            }}
          >
            <PanelLeft />
          </button>
          <div>
            <h1 className="font-header flex items-center gap-2 text-xl">
              <span>Hi {profile?.name?.split(" ")[0]}</span>
            </h1>
            <span className="text-sm opacity-70">03 tasks pending</span>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="button-reactivity opacity-70"
          onClick={() => {
            setThemePickerDialogOpen(true);
          }}
        >
          <SwatchBook />
        </button>
        <button type="button" className="button-reactivity opacity-70">
          <Bell />
        </button>
        <button type="button" className="button-reactivity">
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
