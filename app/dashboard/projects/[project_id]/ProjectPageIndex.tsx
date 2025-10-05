"use client";

import { Project } from "@/src/db/schema/projects";
import { useTaskStore } from "@/src/lib/stores/ui/taskStore";
import InformationTable from "@/src/ui/components/Dashboard/InformationTable";
import TaskAccordion from "@/src/ui/components/Dashboard/TaskAccordion";
import RenderLucide from "@/src/ui/components/RenderLucide";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { Archive, PlusCircle, Settings2, Tag } from "lucide-react";
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
            label="2 tasks"
            variant="destructive"
          />
          <TaskAccordion.body>
            <TaskAccordion.item />
            <TaskAccordion.item />
          </TaskAccordion.body>
        </TaskAccordion.root>

        {/* Task Accordion - Ongoing - Today */}
        <TaskAccordion.root defaultOpen={true}>
          <TaskAccordion.trigger title="Overdue Today" label="18 tasks" />
          <TaskAccordion.body>
            <TaskAccordion.item />
            <TaskAccordion.item />
            <TaskAccordion.item />
            <TaskAccordion.item />
          </TaskAccordion.body>
        </TaskAccordion.root>

        {/* Task Accordion - Ongoing - Upcoming */}
        <TaskAccordion.root defaultOpen={false}>
          <TaskAccordion.trigger title="Ongoing Tasks" label="18 tasks" />
          <TaskAccordion.body>
            <TaskAccordion.item />
            <TaskAccordion.item />
            <TaskAccordion.item />
            <TaskAccordion.item />
          </TaskAccordion.body>
        </TaskAccordion.root>
      </div>
    </div>
  );
};

export default ProjectPageIndex;
