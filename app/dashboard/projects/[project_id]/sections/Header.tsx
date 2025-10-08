"use client";

import React from "react";
import InformationTable from "@/src/ui/components/Dashboard/InformationTable";
import RenderLucide from "@/src/ui/components/RenderLucide";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { Archive, PlusCircle, Settings2, Tag } from "lucide-react";
import { Project } from "@/src/db/schema/projects";
import { useTaskStore } from "@/src/lib/stores/ui/taskStore";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/src/ui/shadcn/components/ui/card";

const HeaderSection = ({ project }: { project: Project }) => {
  // Pull states and setter from task store
  const { setActiveProject, setNewTaskDialogOpen } = useTaskStore();

  return (
    <header className="flex flex-col gap-6 md:grid md:grid-cols-[auto_420px]">
      {/* Project Name */}
      <Card>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Information */}
      <Card>
        <CardHeader className="flex items-center mb-3 justify-between">
          <h1 className="font-header text-2xl">Information</h1>
          <Button variant={"outline"} size={"sm"}>
            <Settings2 />
            Settings
          </Button>
        </CardHeader>
        <CardContent>
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
              title={
                project.projectType === "primary"
                  ? "Can't archived primary project"
                  : "Archived project"
              }
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
        </CardContent>
      </Card>
    </header>
  );
};

export default HeaderSection;
