"use client";

import { CirclePlus, PanelLeftClose, Settings } from "lucide-react";
import { useTaskStore } from "@/src/lib/stores/ui/taskStore";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { useSidebar } from "@/src/ui/shadcn/components/ui/sidebar";

const DsController = () => {
  // Pull setters from useSidebar
  const { setOpen, setOpenMobile } = useSidebar();

  // Pull setters from task store
  const { setNewTaskDialogOpen } = useTaskStore();

  return (
    <div className="grid grid-cols-1 gap-2">
      {/* New Task Button */}
      <Button
        onClick={() => {
          setNewTaskDialogOpen(true);
        }}
      >
        <CirclePlus /> New Task
      </Button>

      <div className="grid grid-cols-2 gap-2">
        <Button variant={"outline"}>
          <Settings />
          Settings
        </Button>
        <Button
          variant={"outline"}
          onClick={() => {
            setOpen(false);
            setOpenMobile(false);
          }}
        >
          <PanelLeftClose />
          Hide Menu
        </Button>
      </div>
    </div>
  );
};

export default DsController;
