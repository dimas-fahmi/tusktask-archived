"use client";

import { useProjectStore } from "@/src/lib/stores/ui/projectStore";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/src/ui/shadcn/components/ui/drawer";
import React, { useEffect } from "react";
import { ChevronDown } from "lucide-react";
import IconPickerDrawer from "../IconPickerDrawer";
import { useIconPickerStore } from "@/src/lib/stores/ui/iconPickerStore";
import RenderLucide from "../../../RenderLucide";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { ProjectsPostRequest } from "@/app/api/projects/post";
import { useCreateProject } from "@/src/lib/hooks/mutations/useCreateProject";
import { useFetchUserProject } from "@/src/lib/hooks/queries/useFetchUserProjects";

const NewProjectDrawer = () => {
  // Pull states from projectStore
  const {
    newProjectDrawerOpen,
    setNewProjectDrawerOpen,
    newProjectIcon,
    setNewProjectIcon,
  } = useProjectStore();

  // Pull states from iconPickerStore
  const { setIconPickerDrawerOpen } = useIconPickerStore();

  // Form
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(
      z.object({
        projectName: z.string().min(3).max(100),
        projectDescription: z.string().optional(),
        icon: z.string().min(1),
      })
    ),
    mode: "onChange",
    defaultValues: {
      projectName: "",
      projectDescription: "",
      icon: newProjectIcon,
    },
  });

  useEffect(() => {
    setValue("icon", newProjectIcon);
  }, [newProjectIcon]);

  // Mutation
  const { mutate: createProject, isPending: isCreatingProject } =
    useCreateProject();

  // Projects query
  const { refetch: refetchProjects } = useFetchUserProject();

  return (
    <>
      <Drawer
        open={newProjectDrawerOpen}
        onOpenChange={setNewProjectDrawerOpen}
      >
        <DrawerContent>
          <div className="max-auto p-4 max-w-2xl w-full mx-auto">
            {/* Header */}
            <DrawerHeader className="sr-only">
              <DrawerTitle>Create New Project</DrawerTitle>
              <DrawerDescription>{`Let's setup a new Project`}</DrawerDescription>
            </DrawerHeader>

            {/* Body */}
            <form
              onSubmit={handleSubmit((data) => {
                if (!isValid) return;

                const request: ProjectsPostRequest = {
                  newProject: {
                    name: data.projectName,
                    description: data?.projectDescription || undefined,
                    icon: data.icon,
                  },
                };

                createProject(request, {
                  onSettled: () => {
                    refetchProjects();
                  },
                });

                setNewProjectDrawerOpen(false);
              })}
              className="mt-6"
            >
              {/* Input Containers */}
              <div className="grid grid-cols-1">
                {/* Project Name Form */}
                <div className="flex flex-col">
                  {/* Title */}
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`p-1 border hover:scale-[1.05] transition-all duration-300 hover:mr-2 rounded-md cursor-pointer opacity-50 active:scale-100 flex items-center gap-0.5`}
                      title="Click to change icon"
                      onClick={() => {
                        setIconPickerDrawerOpen(true);
                      }}
                    >
                      <RenderLucide
                        iconName={newProjectIcon}
                        className="w-10 h-10"
                      />
                      <ChevronDown className="w-3 h-3" />
                    </div>
                    <Controller
                      control={control}
                      name="projectName"
                      render={({ field, fieldState }) => (
                        <input
                          {...field}
                          className={`${fieldState?.error ? "text-destructive" : ""} text-4xl outline-0 capitalize border-0 font-header w-full`}
                          placeholder="Project Name"
                          autoComplete="off"
                        />
                      )}
                    />
                  </div>
                  <textarea
                    placeholder="Description (optional)"
                    className="mt-4 resize-none min-h-42 max-h-72 outline-0 field-sizing-content"
                  />
                </div>
              </div>

              {/* Footer */}
              <DrawerFooter className="p-0 grid grid-cols-2 mt-6">
                <Button
                  type="button"
                  onClick={() => {
                    setNewProjectDrawerOpen(false);
                  }}
                  variant={"outline"}
                >
                  Cancel
                </Button>
                <Button disabled={!isValid || isCreatingProject}>Save</Button>
              </DrawerFooter>
            </form>
          </div>
        </DrawerContent>
      </Drawer>

      <IconPickerDrawer onChange={setNewProjectIcon} />
    </>
  );
};

export default NewProjectDrawer;
