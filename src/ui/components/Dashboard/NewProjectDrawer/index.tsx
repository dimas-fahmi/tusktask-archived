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
import React from "react";
import IconPicker from "./IconPicker";

const NewProjectDrawer = () => {
  // Pull states from projectStore
  const {
    newProjectDrawerOpen,
    setNewProjectDrawerOpen,
    newProjectIcon,
    setNewProjectIcon,
  } = useProjectStore();

  // Render Icon
  const Icon = newProjectIcon;

  return (
    <Drawer open={newProjectDrawerOpen} onOpenChange={setNewProjectDrawerOpen}>
      <DrawerContent className="max-w-7xl mx-auto">
        <div className="overflow-y-scroll scrollbar-none p-4 pt-0">
          {/* Header */}
          <DrawerHeader className="sr-only">
            <DrawerTitle>Create New Project</DrawerTitle>
            <DrawerDescription>{`Let's setup a new Project`}</DrawerDescription>
          </DrawerHeader>

          {/* Body */}
          <form action="" className="mt-6">
            {/* Input Containers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Project Name Form */}
              <div className="flex flex-col md:px-4">
                {/* Title */}
                <div className="flex items-center gap-1.5">
                  <div
                    className={`p-1 border border-transparent hover:border-border rounded-md cursor-pointer opacity-50`}
                  >
                    <Icon className="h-10 w-10" />
                  </div>
                  <input
                    className="text-4xl outline-0 capitalize border-0 font-header"
                    placeholder="Project Name"
                  />
                </div>
                <textarea
                  placeholder="Description (optional)"
                  className="mt-4 resize-none min-h-42 max-h-72 outline-0 field-sizing-content"
                />
              </div>

              {/* Icons Picker */}
              <div className="">
                <h2 className="font-header text-2xl">Pick Icon</h2>
                <p className="mb-4 text-sm">{`Look up anything, whether it's code, a burger, or even a cat. There are over 1.6k icons to choose from!`}</p>
                <IconPicker setIcon={setNewProjectIcon} />
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
              <Button>Save</Button>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NewProjectDrawer;
