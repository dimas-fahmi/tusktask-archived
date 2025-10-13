import Link from "next/link";
import React from "react";
import type { TaskApp } from "@/src/lib/types/tasks";
import { truncateString } from "@/src/lib/utils/truncateString";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/ui/shadcn/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/ui/shadcn/components/ui/tooltip";

export function TaskPageBreadcrumb({ task }: { task: TaskApp }) {
  // Collect the hierarchy of parents
  const hierarchy = [];
  let current = task?.parent;

  while (current) {
    hierarchy.unshift(current); // insert at beginning to reverse order
    current = current.parent;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Optional Ellipsis for collapsed UI */}
        {hierarchy.length > 2 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbEllipsis className="size-4" />
          </>
        )}

        {/* Render each parent */}
        {hierarchy.map((parent, _index) => (
          <React.Fragment key={parent.id}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/dashboard/tasks/detail/${parent.id}`}>
                      {truncateString(parent?.name, 2, true)}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{parent?.name}</TooltipContent>
                </Tooltip>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}

        {/* Current task */}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            <Tooltip>
              <TooltipTrigger>
                {truncateString(task?.name, 2, true)}
              </TooltipTrigger>
              <TooltipContent>{task?.name}</TooltipContent>
            </Tooltip>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
