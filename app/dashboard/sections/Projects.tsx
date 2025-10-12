"use client";

import { CircleFadingPlus, CirclePlus } from "lucide-react";
import type React from "react";
import { useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import type { Project } from "@/src/db/schema/projects";
import type { Task } from "@/src/db/schema/tasks";
import { useFetchUserProjects } from "@/src/lib/hooks/queries/useFetchUserProjects";
import { useProjectStore } from "@/src/lib/stores/ui/projectStore";
import {
  ProjectCard,
  ProjectCardSkeleton,
} from "@/src/ui/components/Dashboard/ProjectCard";

const Projects = () => {
  // Pull states and setter from projectStore
  const { newProjectDrawerOpen, setNewProjectDrawerOpen } = useProjectStore();

  // Drag To Scroll Mechanism
  const containerRef = useRef<HTMLDivElement>(
    null,
  ) as React.RefObject<HTMLInputElement>;
  const { events } = useDraggable(containerRef);

  // Projects query
  const { data: userProjects } = useFetchUserProjects<
    Array<Project & { tasks: Task[] }>
  >({ queryKey: ["projects"] }, { include: "tasks" });
  const projects = userProjects?.result;

  return (
    <section>
      <h1 className="block md:hidden font-header text-2xl mb-2">Projects</h1>

      {/* Projets Container */}
      <div
        ref={containerRef}
        {...events}
        className="flex cursor-grab py-2 gap-4 overflow-hidden scrollbar-none select-none overflow-x-scroll"
      >
        {!projects && !Array.isArray(projects) ? (
          <ProjectCardSkeleton />
        ) : (
          projects.map((item) => <ProjectCard key={item.id} project={item} />)
        )}
        <button
          type="button"
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
