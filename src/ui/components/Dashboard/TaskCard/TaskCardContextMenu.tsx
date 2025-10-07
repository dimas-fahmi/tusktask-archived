import { useDeleteTask } from "@/src/lib/hooks/mutations/useDeleteTask";
import { TaskApp } from "@/src/lib/types/tasks";
import {
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from "@/src/ui/shadcn/components/ui/context-menu";
import { useQueryClient } from "@tanstack/react-query";
import {
  Archive,
  CirclePlus,
  ExternalLink,
  LoaderCircle,
  RefreshCcw,
  Trash,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const TaskCardContextMenu = ({ task }: { task: TaskApp }) => {
  // Delete Mutation
  const { mutate: deleteTask } = useDeleteTask();

  // QueryClient
  const queryClient = useQueryClient();

  return (
    <div>
      <ContextMenuGroup>
        {task?.isPending ? (
          <>
            <ContextMenuItem disabled className="animate-pulse">
              <LoaderCircle className="animate-spin" />
              Saving
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        ) : (
          <>
            <ContextMenuLabel>{task.name}</ContextMenuLabel>
            <ContextMenuSeparator />
          </>
        )}

        <ContextMenuItem disabled={task?.isPending} asChild>
          <Link href={`/dashboard/projects/${task?.id}`}>
            <ExternalLink />
            Open Project
          </Link>
        </ContextMenuItem>
        <ContextMenuItem disabled={task?.isPending}>
          <CirclePlus />
          New Task
        </ContextMenuItem>
        <ContextMenuItem
          disabled={task?.isPending}
          onClick={() => {
            queryClient.invalidateQueries({
              queryKey: ["projects"],
              exact: false,
            });
          }}
        >
          <RefreshCcw />
          Refresh
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled>
          <Archive />
          Archive
        </ContextMenuItem>
        <ContextMenuItem
          variant="destructive"
          onClick={() => {
            deleteTask(task.id);
          }}
        >
          <Trash />
          Delete
        </ContextMenuItem>
      </ContextMenuGroup>
    </div>
  );
};

export default TaskCardContextMenu;
