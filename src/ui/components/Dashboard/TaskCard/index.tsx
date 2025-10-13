import type React from "react";
import type { TaskApp } from "@/src/lib/types/tasks";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/src/ui/shadcn/components/ui/context-menu";
import Card from "./Card";
import TaskCardContextMenu from "./TaskCardContextMenu";

export interface TaskCardProps extends React.HTMLAttributes<HTMLDivElement> {
  task: TaskApp;
}

const TaskCard = ({ task }: { task: TaskApp }) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Card task={task} />
      </ContextMenuTrigger>

      <ContextMenuContent className="min-w-52">
        <TaskCardContextMenu task={task} />
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TaskCard;
