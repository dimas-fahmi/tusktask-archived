"use client";

import { useUpdateTask } from "@/src/lib/hooks/mutations/useUpdateTasks";
import { TaskApp } from "@/src/lib/types/tasks";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/ui/shadcn/components/ui/tooltip";
import { cn } from "@/src/ui/shadcn/lib/utils";
import { Circle, CircleCheckBig } from "lucide-react";
import React from "react";

export interface TaskScratchButtonClasses {
  buttonClassNames?: string;
  iconClassNames?: string;
}

export interface TaskScratchButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  task: TaskApp;
  classes?: TaskScratchButtonClasses;
  disabled?: string;
}

const TaskScratchButton = React.forwardRef<
  HTMLButtonElement,
  TaskScratchButtonProps
>(({ task, classes, ...props }, ref) => {
  // Update Task hooks
  const { mutate: updateTask, isPending: isUpdatingTask } = useUpdateTask([
    "update",
    "task",
  ]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          ref={ref}
          {...props}
          onClick={(e) => {
            e.stopPropagation();
            props?.onClick?.(e);

            updateTask({
              req: {
                id: task.id,
                newValues: {
                  completedAt: task?.completedAt ? null : new Date(),
                },
              },
              old: task,
            });
          }}
          aria-pressed={!!task?.completedAt}
          aria-label={
            task?.completedAt
              ? "Unmark task as completed"
              : "Mark task as completed"
          }
          disabled={isUpdatingTask || !!props?.disabled}
          className={cn(
            `group relative w-6 h-6 cursor-pointer opacity-50 hover:opacity-100 transition-all duration-300`,
            classes?.buttonClassNames,
            props?.className
          )}
        >
          <Circle
            className={cn(
              `${task?.completedAt ? "opacity-0 group-hover:opacity-100" : ""} absolute inset-0 transition-all duration-200`,
              classes?.iconClassNames
            )}
          />
          <CircleCheckBig
            className={cn(
              `${task?.completedAt ? "opacity-100 group-hover:opacity-50" : "opacity-0 group-hover:opacity-100"} absolute inset-0 transition-all duration-200`,
              classes?.iconClassNames
            )}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        {task?.completedAt
          ? "Unmark this task from completed?"
          : "Mark this task as completed?"}
      </TooltipContent>
    </Tooltip>
  );
});

TaskScratchButton.displayName = "TaskScratchButton";

export default TaskScratchButton;
