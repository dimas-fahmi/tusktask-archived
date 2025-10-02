"use client";

import { useProjectStore } from "@/src/lib/stores/ui/projectStore";
import {
  Accessibility,
  CircleFadingPlus,
  CirclePlus,
  LucideIcon,
  Pickaxe,
} from "lucide-react";
import React, { useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";

export const ProjectCard = ({
  title,
  label,
  icon,
}: {
  title: string;
  label: string;
  icon: LucideIcon;
}) => {
  const Icon = icon;

  return (
    <div className="relative p-4 min-h-34 max-h-34 min-w-48 max-w-48 cursor-pointer hover:scale-[1.05] transition-all duration-300 border text-nowrap rounded-md hover:mx-2 hover:bg-primary hover:text-primary-foreground hover:border-transparent shadow-sm text-sm overflow-hidden group/card">
      {/* header */}
      <header>
        <h1 className="font-header group-hover/card:opacity-100 transition-all duration-300 text-xl opacity-50">
          {title}
        </h1>
        <p className="text-sm opacity-50 group-hover/card:opacity-75 transition-all duration-300">
          {label}
        </p>
      </header>
      {/* Icon */}
      <Icon className="absolute group-hover/card:opacity-100 transition-all duration-300 -bottom-5 -right-5 w-24 h-24 opacity-30" />
    </div>
  );
};

const Projects = () => {
  // Pull states and setter from projectStore
  const { newProjectDrawerOpen, setNewProjectDrawerOpen } = useProjectStore();

  // Drag To Scroll Mechanism
  const containerRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLInputElement>;
  const { events } = useDraggable(containerRef);

  return (
    <section>
      <h1 className="block md:hidden font-header text-2xl mb-2">Projects</h1>

      {/* Projets Container */}
      <div
        ref={containerRef}
        {...events}
        className="flex cursor-grab py-2 gap-4 overflow-hidden scrollbar-none select-none overflow-x-scroll"
      >
        <ProjectCard title="Gemini Project" label="08 Tasks" icon={Pickaxe} />
        <ProjectCard
          title="Azura Project"
          label="24 Tasks"
          icon={Accessibility}
        />
        <button
          className="p-4 cursor-pointer hover:scale-[1.05] transition-all duration-300 border text-nowrap rounded-md group text-sm border-dashed flex items-center justify-center flex-col
         hover:bg-primary hover:text-primary-foreground hover:border-transparent
        "
          disabled={newProjectDrawerOpen}
          onClick={() => {
            setNewProjectDrawerOpen(true);
          }}
        >
          <div className="relative h-6 w-full">
            <CirclePlus
              className=" absolute inset-0 mx-auto group-hover:opacity-100 opacity-0 tranis1
             duration-300"
            />
            <CircleFadingPlus
              className=" absolute inset-0 mx-auto group-hover:opacity-0 opacity-50 tranis1
             duration-300"
            />
          </div>
          <span className="opacity-50 text-xs block mt-2 group-hover:opacity-100 transition-all duration-300">
            New Project
          </span>
        </button>
      </div>
    </section>
  );
};

export default Projects;
