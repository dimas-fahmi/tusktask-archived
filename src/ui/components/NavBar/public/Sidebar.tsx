"use client";

import React from "react";
import { motion } from "motion/react";
import { PanelLeftClose } from "lucide-react";
import { usePublicSidebarStore } from "@/src/lib/stores/ui/publicSidebar";
import { NAVIGATIONS } from "@/src/lib/configs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const PublicSidebar = () => {
  // Public Sidebar State
  const { open, setOpen } = usePublicSidebarStore();

  // Pathname
  const pathname = usePathname();

  return (
    <>
      <motion.div
        initial={{ x: -400 }}
        animate={open ? { x: 0 } : { x: -400 }}
        transition={{ duration: 0.3, type: "tween" }}
        className={`fixed bg-sidebar p-4 top-0 z-30 left-0 bottom-0 w-[320px]`}
      >
        {/* Sidebar header */}
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-header font-bold">TuskTask</h1>
          <button onClick={() => setOpen(false)}>
            <PanelLeftClose />
          </button>
        </header>

        {/* Navigations */}
        <div className="grid grid-cols-1 mt-6 gap-2">
          {NAVIGATIONS.map((item, index) => (
            <Link
              href={item.href}
              className={`${
                pathname.startsWith(item.href)
                  ? "bg-secondary text-secondary-foreground"
                  : ""
              } border py-2 rounded-4xl text-sm px-4`}
              key={index}
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button variant={"outline"} asChild>
            <Link href={"/auth"}>Sign In</Link>
          </Button>
          <Button asChild>
            <Link href={"/auth/register"}>Sign Up</Link>
          </Button>
        </div>
      </motion.div>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`${
          open ? "opacity-50" : "opacity-0 pointer-events-none"
        } fixed inset-0 bg-foreground transition-all duration-300 z-20`}
      />
    </>
  );
};

export default PublicSidebar;
