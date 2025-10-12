"use client";

import { useEffect } from "react";
import type { Project } from "@/src/db/schema/projects";
import type { Task } from "@/src/db/schema/tasks";
import { useFetchTasks } from "@/src/lib/hooks/queries/useFetchTasks";
import { useFetchUserProjects } from "@/src/lib/hooks/queries/useFetchUserProjects";
import { useTaskStore } from "@/src/lib/stores/ui/taskStore";
import { queryKeys } from "@/src/lib/utils/queryKeys";
import HeaderSection from "./sections/Header";
import TaskCollectionsSection from "./sections/TasksCollections";

const ProjectPageIndex = ({
  projectFromServer,
}: {
  projectFromServer: Project;
}) => {
  // Query Project Data
  const { data: projectResult } = useFetchUserProjects<Project[]>(
    {
      queryKey: queryKeys.projects.detail(projectFromServer.id),
    },
    {
      id: projectFromServer?.id,
    },
  );
  const project = projectResult?.result?.[0] ?? projectFromServer;

  // Pull states and setters from taskStore
  const { activeProject, setActiveProject } = useTaskStore();

  // Set Default Active Project On Mount
  useEffect(() => {
    if (!project) return;
    if (activeProject?.id === project.id) return;

    setActiveProject(project);
  }, [activeProject?.id, project, setActiveProject]);

  // Query Tasks
  const { data: tasksResult } = useFetchTasks<Task[]>(
    queryKeys.tasks.project(projectFromServer.id),
    {
      projectId: projectFromServer.id,
    },
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
