"use client";

import { NAVIGATIONS } from "@/src/lib/configs";
import Link from "next/link";
import React, { useState } from "react";
import { CircleUser, PanelLeftOpen } from "lucide-react";
import { usePublicSidebarStore } from "@/src/lib/stores/ui/publicSidebar";

export type NavItem = (typeof NAVIGATIONS)[number];

const NavigationItem = ({
  item,
  active,
  setActive,
}: {
  item: NavItem;
  active: boolean;
  setActive?: () => void;
}) => {
  return (
    <li>
      <Link
        href={item?.href}
        onClick={setActive}
        className={`${
          active ? "bg-secondary" : ""
        } p-2 text-sm px-4 rounded-2xl h-8 flex items-center justify-center transition-all duration-300`}
      >
        {item.title}
      </Link>
    </li>
  );
};

const Navigations = () => {
  const [active, setActive] = useState<number>(0);
  // Public Sidebar State
  const { toggleOpen, open } = usePublicSidebarStore();

  return (
    <div className="flex border rounded-2xl items-center overflow-hidden">
      <ul className="md:flex items-center overflow-hidden hidden">
        {NAVIGATIONS.map((item, index) => (
          <NavigationItem
            item={item}
            active={active === index}
            key={index}
            setActive={() => setActive(index)}
          />
        ))}
      </ul>
      <button
        className={`${
          open
            ? "bg-secondary text-secondary-foreground"
            : "hover:bg-secondary hover:text-secondary-foreground"
        } ms-2 cursor-pointer text-sm p-2 rounded-2xl transition-all duration-300`}
        onClick={() => toggleOpen()}
      >
        <PanelLeftOpen className="w-4.5 h-4.5" />
      </button>
      <Link
        href={"/auth"}
        className={`cursor-pointer hover:bg-secondary hover:text-secondary-foreground text-sm p-2 rounded-2xl transition-all duration-300`}
      >
        <CircleUser className="w-4.5 h-4.5" />
      </Link>
    </div>
  );
};

export default Navigations;
