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
  CircleAlert,
  Clock1,
  ClockAlert,
  Save,
  Settings2,
  Zap,
} from "lucide-react";
import { DatePicker } from "../../../DatePicker";
import { Controller, useForm } from "react-hook-form";
import RenderLucide from "../../../RenderLucide";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  NewTaskFormSchema,
  newTaskFormSchema,
} from "@/src/lib/zod/schemas/taskSchema";

const NewTaskDialog = () => {
  // Pull setters and states from store
  const {
    newTaskDialogOpen,
    setNewTaskDialogOpen,
    activeProject,
    setActiveProject,
  } = useTaskStore();

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Advance State
  const [advance, setAdvance] = useState(false);

  // Form
  const formDefaultValues = {
    taskProjectId: "",
    taskName: "",
    taskDescription: "",
    taskPriority: "medium",
    taskDeadline: undefined,
    taskReminder: undefined,
  } as const;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isValid },
  } = useForm<NewTaskFormSchema>({
    resolver: zodResolver(newTaskFormSchema),
    mode: "onChange",
    defaultValues: formDefaultValues,
  });

  // Watch for deadline, reminder and priority
  const deadline = watch("deadlineAt");
  const reminder = watch("reminderAt");
  const priority = watch("taskPriority");

  // Check if reminder is valid
  const isReminderValid =
    reminder && deadline
      ? deadline?.getTime() < reminder?.getTime()
        ? false
        : true
      : true;

  // Listen to isReminderValid to set Error
  useEffect(() => {
    if (!isReminderValid) {
      setError("Provide a valid reminder time prior to deadline date.");
    } else {
      setError(null);
    }
  }, [isReminderValid, setError]);

  // Projects query
  const { data: userProjects } = useFetchUserProject<
    Array<Project & { tasks: Task[] }>
  >({ include: "tasks" });
  const projects = userProjects?.result;

  // Sync task reminder with deadline, set it to undefined if deadline is resetted
  useEffect(() => {
    if (!deadline) {
      setValue("reminderAt", undefined);
    }
  }, [deadline, setValue]);

  // Sync set default active project once projects is fetched
  useEffect(() => {
    if (projects) {
      const find = projects.find((item) => item.projectType === "primary");
      setActiveProject(find);
      setValue("projectId", find?.id || "");
    }
  }, [setValue, projects, setActiveProject]);

  // Render the activeProject icon
  const ActiveProjectIcon = activeProject ? (
    <RenderLucide iconName={activeProject?.icon} />
  ) : (
    <Clock1 />
  );

  return (
    <Dialog
      open={newTaskDialogOpen}
      onOpenChange={(e) => {
        reset(formDefaultValues);
        setTimeout(() => {
          setAdvance(false);
        }, 500);
        setNewTaskDialogOpen(e);
      }}
    >
      <DialogContent className="p-0 overflow-hidden">
        {/* Header [hidden] */}
        <DialogHeader className="sr-only">
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>Create New Task</DialogDescription>
        </DialogHeader>

        {/* Content */}
        <form
          onSubmit={handleSubmit(() => {
            // console.log(data);
          })}
        >
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
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <input
                      {...field}
                      className="text-4xl font-header outline-0 border-0 px-4 w-full h-full"
                      placeholder="Task Name"
                    />
                  )}
                />
              </div>

              {/* Task Description */}
              <div>
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <textarea
                      value={field.value || ""}
                      onChange={field.onChange}
                      className="text-sm opacity-70 field-sizing-content min-h-16 max-h-42 px-4 outline-0 border-0 resize-none w-full"
                      placeholder="Description (optional)"
                    />
                  )}
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
                  <button
                    className={`${priority?.toLowerCase() === "low" ? "bg-primary text-primary-foreground" : "hover:bg-primary hover:text-primary-foreground "} p-2 rounded-md border text-xs transition-all duration-300 cursor-pointer`}
                    onClick={() => {
                      setValue("taskPriority", "low");
                    }}
                  >
                    Low
                  </button>
                  <button
                    className={`${priority?.toLowerCase() === "medium" ? "bg-primary text-primary-foreground" : "hover:bg-primary hover:text-primary-foreground "} p-2 rounded-md border text-xs transition-all duration-300 cursor-pointer`}
                    onClick={() => {
                      setValue("taskPriority", "medium");
                    }}
                  >
                    Medium
                  </button>
                  <button
                    className={`${priority?.toLowerCase() === "high" ? "bg-primary text-primary-foreground" : "hover:bg-primary hover:text-primary-foreground "} p-2 rounded-md border text-xs transition-all duration-300 cursor-pointer`}
                    onClick={() => {
                      setValue("taskPriority", "high");
                    }}
                  >
                    High
                  </button>
                  <button
                    className={`${priority?.toLowerCase() === "urgent" ? "bg-primary text-primary-foreground" : "hover:bg-primary hover:text-primary-foreground "} p-2 rounded-md border text-xs transition-all duration-300 cursor-pointer`}
                    onClick={() => {
                      setValue("taskPriority", "urgent");
                    }}
                  >
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
                    name="deadlineAt"
                    render={({ field }) => (
                      <DatePicker
                        value={field.value || undefined}
                        onChange={field.onChange}
                        classes={{ triggerClass: "w-full" }}
                        label="Set Deadline"
                        calendarProps={{
                          disabled: {
                            before: new Date(),
                          },
                        }}
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
                    name="reminderAt"
                    render={({ field }) => (
                      <DatePicker
                        value={field.value || undefined}
                        onChange={field.onChange}
                        classes={{ triggerClass: "w-full" }}
                        label="Set Reminder"
                        calendarProps={{
                          modifiers: {
                            deadline: deadline || undefined,
                          },
                          modifiersClassNames: {
                            deadline:
                              "bg-destructive text-destructive-foreground rounded-md hover:bg-destructive",
                          },
                          disabled: {
                            before: new Date(),
                            after: deadline || undefined,
                          },
                        }}
                        disabled={!deadline}
                      />
                    )}
                  />
                </div>
              </div>
            </motion.div>

            {/* Error */}
            <motion.div
              initial={{ height: 0 }}
              animate={error ? { height: "auto" } : { height: 0 }}
              transition={{
                duration: 0.3,
              }}
              className="overflow-hidden"
            >
              {/* Wrapper */}
              <div className="px-4 mt-4">
                <div className="text-xs bg-destructive/20 flex items-center gap-2 p-2 rounded-md text-destructive">
                  <CircleAlert />
                  {error}
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
                  reset(formDefaultValues);
                  setTimeout(() => {
                    setAdvance(false);
                  }, 500);
                  setNewTaskDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button disabled={!isValid || !isReminderValid}>
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
