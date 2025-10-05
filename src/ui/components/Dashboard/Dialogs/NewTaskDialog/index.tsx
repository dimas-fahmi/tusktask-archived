"use client";

import { Project } from "@/src/db/schema/projects";
import { Task } from "@/src/db/schema/tasks";
import { useFetchUserProject } from "@/src/lib/hooks/queries/useFetchUserProjects";
import { useTaskStore } from "@/src/lib/stores/ui/taskStore";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/shadcn/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/ui/shadcn/components/ui/select";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  AlarmClock,
  Clock1,
  ClockAlert,
  Save,
  Settings2,
  Zap,
} from "lucide-react";
import { DatePicker } from "../../../DatePicker";
import { Controller, useForm } from "react-hook-form";
import RenderLucide from "../../../RenderLucide";

const NewTaskDialog = () => {
  // Pull setters and states from store
  const {
    newTaskDialogOpen,
    setNewTaskDialogOpen,
    activeProject,
    setActiveProject,
  } = useTaskStore();

  // Projects query
  const { data: userProjects } = useFetchUserProject<
    Array<Project & { tasks: Task[] }>
  >({ include: "tasks" });
  const projects = userProjects?.result;

  // Advance State
  const [advance, setAdvance] = useState(false);

  // Form
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      taskName: "",
      taskDescription: "",
      taskPriority: "low",
      taskDeadline: undefined,
      taskReminder: undefined,
      taskProjectId: "",
    },
  });

  const deadline = watch("taskDeadline");

  useEffect(() => {
    if (!deadline) {
      setValue("taskReminder", undefined);
    }
  }, [deadline, setValue]);

  useEffect(() => {
    if (projects) {
      const find = projects.find((item) => item.projectType === "primary");
      setActiveProject(find);
      setValue("taskProjectId", find?.id || "");
      console.log(find);
    }
  }, [setValue, projects, setActiveProject]);

  console.log(activeProject);

  const ActiveProjectIcon = activeProject ? (
    <RenderLucide iconName={activeProject?.icon} />
  ) : (
    <Clock1 />
  );

  return (
    <Dialog open={newTaskDialogOpen} onOpenChange={setNewTaskDialogOpen}>
      <DialogContent className="p-0 overflow-hidden">
        {/* Header [hidden] */}
        <DialogHeader className="sr-only">
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>Create New Task</DialogDescription>
        </DialogHeader>

        {/* Content */}
        <form onSubmit={handleSubmit(() => {})}>
          {/* Forms Container */}
          <div className="py-4">
            {/* Task Name & Description Form */}
            <motion.div
              initial={{ height: "auto" }}
              animate={advance ? { height: 0 } : { height: "auto" }}
              transition={{
                duration: 0.3,
              }}
              className="overflow-hidden"
            >
              {/* Task Name */}
              <div>
                <input
                  className="text-4xl font-header outline-0 border-0 px-4 w-full h-full"
                  placeholder="Task Name"
                />
              </div>

              {/* Task Description */}
              <div>
                <textarea
                  className="text-sm opacity-70 field-sizing-content min-h-16 max-h-42 px-4 outline-0 border-0 resize-none w-full"
                  placeholder="Description (optional)"
                />
              </div>
            </motion.div>

            {/* Task Advance Settings */}
            <motion.div
              initial={{ height: 0 }}
              animate={advance ? { height: "auto" } : { height: 0 }}
              transition={{
                duration: 0.3,
              }}
              className="overflow-hidden space-y-4"
            >
              {/* Priority */}
              <div className="px-4">
                <h1 className="flex items-center font-header text-xl gap-2 mb-2">
                  <Zap className="w-5 h-5" />
                  Priority
                </h1>

                {/* Container */}
                <div className="grid grid-cols-4 gap-2">
                  <button className="p-2 rounded-md border text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-pointer">
                    Low
                  </button>
                  <button className="p-2 rounded-md border text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-pointer">
                    Medium
                  </button>
                  <button className="p-2 rounded-md border text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-pointer">
                    High
                  </button>
                  <button className="p-2 rounded-md border text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-pointer">
                    Urgent
                  </button>
                </div>
              </div>

              {/* Deadline */}
              <div className="px-4">
                <h1 className="flex items-center font-header text-xl gap-2 mb-2">
                  <ClockAlert className="w-5 h-5" />
                  Deadline
                </h1>

                {/* Container */}
                <div>
                  <Controller
                    control={control}
                    name="taskDeadline"
                    render={({ field }) => (
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        classes={{ triggerClass: "w-full" }}
                        label="Set Deadline"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Reminder */}
              <div className="px-4">
                <h1 className="flex items-center font-header text-xl gap-2 mb-2">
                  <AlarmClock className="w-5 h-5" />
                  Reminder
                </h1>

                {/* Container */}
                <div>
                  <Controller
                    control={control}
                    name="taskReminder"
                    render={({ field }) => (
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        classes={{ triggerClass: "w-full" }}
                        label="Set Reminder"
                        calendarProps={{
                          hidden: {
                            after: deadline,
                            before: new Date(),
                          },
                          disableNavigation: true,
                        }}
                        disabled={!deadline}
                      />
                    )}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <footer className="flex items-center justify-between p-4 border-t">
            {/* Project Select */}
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant={advance ? "default" : "outline"}
                onClick={() => {
                  setAdvance(!advance);
                }}
              >
                <Settings2 />
              </Button>
              <Select
                value={activeProject?.id || ""}
                onValueChange={(id) => {
                  const find = projects?.find((item) => item.id === id);
                  setActiveProject(find);
                }}
              >
                <SelectTrigger className="max-w-34 min-w-34 text-xs">
                  <SelectValue placeholder={"Project"}>
                    {ActiveProjectIcon} {activeProject?.name}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent className="text-xs">
                  <SelectGroup>
                    <SelectLabel>Projects</SelectLabel>
                    {projects &&
                      Array.isArray(projects) &&
                      projects.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          <RenderLucide iconName={item?.icon} /> {item.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Controller */}
            <div className="flex gap-2 items-center">
              <Button
                className="hidden md:block"
                type="button"
                variant={"outline"}
                onClick={() => {
                  setNewTaskDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button disabled={!isValid}>
                <Save />
                Save
              </Button>
            </div>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;
