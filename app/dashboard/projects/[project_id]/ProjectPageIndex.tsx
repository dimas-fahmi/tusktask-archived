"use client";

import { Project } from "@/src/db/schema/projects";
import { Task } from "@/src/db/schema/tasks";
import { useFetchTasks } from "@/src/lib/hooks/queries/useFetchTasks";
import { useTaskStore } from "@/src/lib/stores/ui/taskStore";
import { categorizeTasks } from "@/src/lib/utils/categorizedTasks";
import InformationTable from "@/src/ui/components/Dashboard/InformationTable";
import TaskAccordion from "@/src/ui/components/Dashboard/TaskAccordion";
import RenderLucide from "@/src/ui/components/RenderLucide";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { Archive, CircleAlert, PlusCircle, Settings2, Tag } from "lucide-react";
import React, { useEffect } from "react";

const ProjectPageIndex = ({ project }: { project: Project }) => {
  // Pull states and setters from taskStore
  const { activeProject, setActiveProject, setNewTaskDialogOpen } =
    useTaskStore();

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
  const { archived, completed, ongoing, overdue, overdueSoon, tomorrow } =
    categorizeTasks(tasks);

  return (
    <div className="dashboard-padding grid grid-cols-1">
      {/* Header */}
      <header className="flex flex-col gap-6 md:grid md:grid-cols-[auto_420px]">
        {/* Project Name */}
        <div>
          <h1 className="flex items-center gap-1.5 text-4xl font-header py-2">
            <RenderLucide
              iconName={project.icon ?? "Clock1"}
              className="w-10 h-10"
            />
            {project?.name || "Untitled"}
          </h1>
          <p className="text-sm opacity-70 mt-4">
            {project?.description || "No description"}
          </p>
        </div>

        {/* Information */}
        <div>
          <header className="flex items-center mb-3 justify-between">
            <h1 className="font-header text-2xl">Information</h1>
            <Button variant={"outline"} size={"sm"}>
              <Settings2 />
              Settings
            </Button>
          </header>
          <InformationTable
            deadline={
              project?.projectType === "primary"
                ? undefined
                : project?.deadlineAt
            }
            priorityLevel={project?.priority}
            status={
              project?.projectType === "primary"
                ? undefined
                : project?.projectStatus
            }
            rows={[
              {
                icon: Tag,
                title: "Project Type",
                content: (
                  <span className="capitalize">{project.projectType}</span>
                ),
              },
            ]}
          />

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button
              variant={"outline"}
              disabled={project.projectType === "primary"}
            >
              <Archive /> Archive
            </Button>
            <Button
              onClick={() => {
                setActiveProject(project);
                setNewTaskDialogOpen(true);
              }}
            >
              <PlusCircle /> New Task
            </Button>
          </div>
        </div>
      </header>

      {/* Separator */}
      <div className="mt-12">
        <h1 className="text-4xl font-header">Tasks Collections</h1>
      </div>

      {/* Content */}
      <div className="mt-4 min-h-[500px] space-y-4 pb-16">
        {/* Task Accordion - Overdue */}
        <TaskAccordion.root defaultOpen={true}>
          <TaskAccordion.trigger
            title="Overdue"
            label={`${!overdue.length ? "No" : overdue.length.toString().padStart(2, "0")} tasks`}
            variant="destructive"
          />
          <TaskAccordion.body>
            {!overdue.length ? (
              <div className="opacity-50 text-sm py-2 bg-muted text-muted-foreground rounded-md mx-auto flex items-center gap-2 justify-center">
                <CircleAlert className="w-5 h-5" />
                Good Job, No tasks passed their deadlines!
              </div>
            ) : (
              overdue.map((item) => <TaskAccordion.item key={item.id} />)
            )}
          </TaskAccordion.body>
        </TaskAccordion.root>

        {/* Task Accordion - Overdue Soon */}
        <TaskAccordion.root defaultOpen={true}>
          <TaskAccordion.trigger
            title="Overdue Soon"
            label={`${!overdueSoon.length ? "No" : overdueSoon.length.toString().padStart(2, "0")} tasks`}
          />
          <TaskAccordion.body>
            {!overdueSoon.length ? (
              <div className="opacity-50 text-sm py-2 bg-muted text-muted-foreground rounded-md mx-auto flex items-center gap-2 justify-center">
                <CircleAlert className="w-5 h-5" />
                No tasks is going to overdue in the next 24H
              </div>
            ) : (
              overdueSoon.map((item) => <TaskAccordion.item key={item.id} />)
            )}
          </TaskAccordion.body>
        </TaskAccordion.root>

        {/* Task Accordion - Overdue Tomorrow */}
        <TaskAccordion.root defaultOpen={true}>
          <TaskAccordion.trigger
            title="Overdue Tomorrow"
            label={`${!tomorrow.length ? "No" : tomorrow.length.toString().padStart(2, "0")} tasks`}
          />
          <TaskAccordion.body>
            {!tomorrow.length ? (
              <div className="opacity-50 text-sm py-2 bg-muted text-muted-foreground rounded-md mx-auto flex items-center gap-2 justify-center">
                <CircleAlert className="w-5 h-5" />
                No tasks is going to overdue in tomorrow
              </div>
            ) : (
              tomorrow.map((item) => <TaskAccordion.item key={item.id} />)
            )}
          </TaskAccordion.body>
        </TaskAccordion.root>

        {/* Task Accordion - Ongoing */}
        <TaskAccordion.root defaultOpen={true}>
          <TaskAccordion.trigger
            title="Ongoing Tasks"
            label={`${!ongoing.length ? "No" : ongoing.length.toString().padStart(2, "0")} tasks`}
          />
          <TaskAccordion.body>
            {!ongoing.length ? (
              <div className="opacity-50 text-sm py-2 bg-muted text-muted-foreground rounded-md mx-auto flex items-center gap-2 justify-center">
                <CircleAlert className="w-5 h-5" />
                No ongoing tasks, create a new one!
              </div>
            ) : (
              ongoing.map((item) => <TaskAccordion.item key={item.id} />)
            )}
          </TaskAccordion.body>
        </TaskAccordion.root>

        {/* Task Accordion - Archived */}
        <TaskAccordion.root defaultOpen={false}>
          <TaskAccordion.trigger
            title="Archived Tasks"
            label={`${!archived.length ? "No" : archived.length.toString().padStart(2, "0")} tasks`}
          />
          <TaskAccordion.body>
            {!archived.length ? (
              <div className="opacity-50 text-sm py-2 bg-muted text-muted-foreground rounded-md mx-auto flex items-center gap-2 justify-center">
                <CircleAlert className="w-5 h-5" />
                No archived tasks!
              </div>
            ) : (
              archived.map((item) => <TaskAccordion.item key={item.id} />)
            )}
          </TaskAccordion.body>
        </TaskAccordion.root>

        {/* Task Accordion - Completed Tasks */}
        <TaskAccordion.root defaultOpen={false}>
          <TaskAccordion.trigger
            title="Completed Tasks"
            label={`${!completed.length ? "No" : completed.length.toString().padStart(2, "0")} tasks`}
          />
          <TaskAccordion.body>
            {!completed.length ? (
              <div className="opacity-50 text-sm py-2 bg-muted text-muted-foreground rounded-md mx-auto flex items-center gap-2 justify-center">
                <CircleAlert className="w-5 h-5" />
                You can do better than that!
              </div>
            ) : (
              completed.map((item) => <TaskAccordion.item key={item.id} />)
            )}
          </TaskAccordion.body>
        </TaskAccordion.root>
      </div>
    </div>
  );
};

export default ProjectPageIndex;
