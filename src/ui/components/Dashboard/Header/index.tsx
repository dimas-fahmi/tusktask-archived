"use client";

import { Settings2 } from "lucide-react";
import { useSidebar } from "@/src/ui/shadcn/components/ui/sidebar";

const Header = () => {
  // Pull setters
  const { setOpenMobile } = useSidebar();

  return (
    <header className="grid grid-cols-1 md:grid-cols-[auto_280px] justify-between mb-6 md:mb-4">
      {/* Header */}
      <h1 className="text-4xl hidden md:block font-header">Projects</h1>

      {/* Search Form */}
      <div className="flex items-center gap-2 w-full">
        <input
          placeholder="Search tasks"
          className="bg-muted w-full text-sm h-10 px-4 py-2 rounded-full"
        />

        <button
          type="button"
          className="md:hidden flex items-center justify-center bg-primary text-primary-foreground p-2 h-10 w-10 rounded-full"
          onClick={() => {
            setOpenMobile(true);
          }}
        >
          <Settings2 />
        </button>
      </div>
    </header>
  );
};

export default Header;
