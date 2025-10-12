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
import { useDeleteProject } from "@/src/lib/hooks/mutations/useDeleteProject";
import { useTaskStore } from "@/src/lib/stores/ui/taskStore";
import type { ProjectApp } from "@/src/lib/types/projects";
import {
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from "@/src/ui/shadcn/components/ui/context-menu";

const ProjectCardContextMenu = ({ project }: { project: ProjectApp }) => {
  // Delete Mutation
  const { mutate: deleteProject } = useDeleteProject();

  // QueryClient
  const queryClient = useQueryClient();

  // Pull states from tasks store
  const { openNewTaskDialog } = useTaskStore();

  return (
    <div>
      <ContextMenuGroup>
        {project?.isPending ? (
          <>
            <ContextMenuItem disabled className="animate-pulse">
              <LoaderCircle className="animate-spin" />
              Saving
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        ) : (
          <>
            <ContextMenuLabel>{project.name}</ContextMenuLabel>
            <ContextMenuSeparator />
          </>
        )}

        <ContextMenuItem disabled={project?.isPending} asChild>
          <Link href={`/dashboard/projects/${project?.id}`}>
            <ExternalLink />
            Open Project
          </Link>
        </ContextMenuItem>
        <ContextMenuItem
          disabled={project?.isPending}
          onClick={() => {
            if (!project) return;
            openNewTaskDialog(project);
          }}
        >
          <CirclePlus />
          New Task
        </ContextMenuItem>
        <ContextMenuItem
          disabled={project?.isPending}
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
          disabled={project?.isPending || project.projectType === "primary"}
          onClick={() => {
            deleteProject(project.id);
          }}
          title={
            project?.projectType === "primary"
              ? "Can't delete your primary project"
              : "Click to delete this project"
          }
        >
          <Trash />
          Delete
        </ContextMenuItem>
      </ContextMenuGroup>
    </div>
  );
};

export default ProjectCardContextMenu;
