import { useDeleteProject } from "@/src/lib/hooks/mutations/useDeleteProject";
import { ProjectApp } from "@/src/lib/types/projects";
import {
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from "@/src/ui/shadcn/components/ui/context-menu";
import {
  Archive,
  CirclePlus,
  ExternalLink,
  LoaderCircle,
  Trash,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const ProjectCardContextMenu = ({ project }: { project: ProjectApp }) => {
  // Delete Mutation
  const { mutate: deleteProject } = useDeleteProject();

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
        <ContextMenuItem disabled={project?.isPending}>
          <CirclePlus />
          New Task
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
