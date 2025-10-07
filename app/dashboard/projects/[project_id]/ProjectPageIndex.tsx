"use client";

import { Project } from "@/src/db/schema/projects";
import { Task } from "@/src/db/schema/tasks";
import { useFetchTasks } from "@/src/lib/hooks/queries/useFetchTasks";
import { useTaskStore } from "@/src/lib/stores/ui/taskStore";
import React, { useEffect } from "react";
import HeaderSection from "./sections/Header";
import TaskCollectionsSection from "./sections/TasksCollections";

const ProjectPageIndex = ({ project }: { project: Project }) => {
  // Pull states and setters from taskStore
  const { activeProject, setActiveProject } = useTaskStore();

  // Set Default Active Project On Mount
  useEffect(() => {
    if (activeProject?.id === project.id) return;

    setActiveProject(project);
  }, [setActiveProject]);

  // Query Tasks
  const { data: tasksResult } = useFetchTasks<Task[]>(
    ["tasks", `project-${project.id}`],
    {
      projectId: project.id,
    }
  );

  const tasks = tasksResult?.result;

  return (
    <div className="dashboard-padding grid grid-cols-1">
      {/* Header */}
      <HeaderSection project={project} />

      {/* Separator */}
      <div className="mt-12">
        <h1 className="text-4xl font-header">Tasks Collections</h1>
      </div>

      {/* Content */}
      <TaskCollectionsSection tasks={tasks} />
    </div>
  );
};

export default ProjectPageIndex;
