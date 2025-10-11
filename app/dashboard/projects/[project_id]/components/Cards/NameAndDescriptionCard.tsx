"use client";

import { useIconPickerStore } from "@/src/lib/stores/ui/iconPickerStore";
import { ProjectApp } from "@/src/lib/types/projects";
import RenderLucide from "@/src/ui/components/RenderLucide";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { Card, CardContent } from "@/src/ui/shadcn/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { motion, Variants } from "motion/react";
import { Pencil, PencilOff } from "lucide-react";
import { useUpdateProject } from "@/src/lib/hooks/mutations/useUpdateProject";
import { projectFormSchema } from "@/src/lib/zod/schemas/projectSchema";
import { DEFAULT_ICON } from "@/src/lib/configs";

export const motionVariants = {
  hidden: {
    opacity: 0,
    x: 30,
    scale: 0.98,
    filter: "blur(4px)",
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1], // standard ease-out
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // smooth spring-like easing
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    scale: 0.97,
    filter: "blur(3px)",
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1], // smooth ease-in
    },
  },
} satisfies Variants;

const NameAndDescriptionCard = ({ project }: { project?: ProjectApp }) => {
  // Pull states from icon picker store
  const { setIconPickerDrawerOpen, pickedIcon, setPickedIcon } =
    useIconPickerStore();

  // Edit Mode Status
  const [editMode, setEditMode] = useState(false);

  // Form
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(projectFormSchema),
    mode: "onChange",
    defaultValues: {
      name: project?.name,
      description: project?.description || "",
      icon: project?.icon || DEFAULT_ICON,
    },
  });

  const icon = watch("icon");

  useEffect(() => {
    if (project) {
      // No need to set icon, sync below everytime pickedIcon change
      setValue("name", project?.name);
      setValue("description", project?.description || undefined);
    }
    setPickedIcon(project?.icon || DEFAULT_ICON);
  }, [project]);

  useEffect(() => {
    if (pickedIcon) {
      // Sync picked icon
      setValue("icon", pickedIcon);
    }
  }, [setValue, pickedIcon]);

  // Mutation
  const { mutate: updateProject, isPending: isUpdatingProject } =
    useUpdateProject(["update", "project"]);

  useEffect(() => {
    if (!editMode) {
      reset({
        name: project?.name,
        description: project?.description || "",
        icon: pickedIcon,
      });
    }
  }, [editMode, pickedIcon, setPickedIcon]);

  return (
    <>
      <Card>
        <CardContent className="h-full group/card">
          <form
            onSubmit={handleSubmit((data) => {
              if (!isValid || isUpdatingProject) return;
              if (project) {
                updateProject(
                  {
                    id: project?.id,
                    newValues: {
                      ...data,
                    },
                  },
                  {
                    onError: () => {
                      setEditMode(true);
                    },
                  }
                );

                setEditMode(false);
              }
            })}
            className="flex flex-col justify-between h-full gap-4"
          >
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center gap-1.5 text-4xl font-header py-2">
                <RenderLucide
                  iconName={icon ?? project?.icon ?? DEFAULT_ICON}
                  className={`${editMode ? "border-border cursor-pointer" : "border-transparent"} border p-1 rounded-md box-content w-10 h-10`}
                  onClick={() => {
                    setEditMode(true);
                    setIconPickerDrawerOpen(true);
                  }}
                />
                {!editMode ? (
                  <h1
                    onClick={() => {
                      setEditMode(true);
                    }}
                  >
                    {project?.name || "Untitled"}
                  </h1>
                ) : (
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <input
                        {...field}
                        autoFocus={true}
                        autoComplete="off"
                        placeholder="Project Name"
                        className="border-1 p-1 w-full px-4 rounded-md outline-0"
                      />
                    )}
                  />
                )}
              </div>

              {editMode ? (
                <Controller
                  control={control}
                  name="description"
                  render={({
                    field: { value, onChange, name, ...fieldProps },
                  }) => (
                    <textarea
                      value={value || ""}
                      onChange={onChange}
                      name={name}
                      {...fieldProps}
                      className="w-full outline-0 resize-none field-sizing-content max-h-52 scrollbar-none p-4 border rounded-md h-full"
                      placeholder="Project description"
                    />
                  )}
                />
              ) : (
                <p
                  className="text-sm opacity-70 mt-4"
                  onClick={() => {
                    setEditMode(true);
                  }}
                >
                  {project?.description || "No description"}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  setEditMode(!editMode);
                }}
                className="opacity-0 group-hover/card:opacity-100"
              >
                {!editMode ? <Pencil /> : <PencilOff />}
              </Button>
              <motion.div
                variants={motionVariants}
                animate={editMode ? "visible" : "hidden"}
                className="flex justify-end gap-2"
              >
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => {
                    setEditMode(false);
                  }}
                >
                  Cancel
                </Button>
                <Button disabled={!isValid || isUpdatingProject}>Save</Button>
              </motion.div>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default NameAndDescriptionCard;
