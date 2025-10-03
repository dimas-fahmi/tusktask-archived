"use client";

import { Skeleton } from "@/src/ui/shadcn/components/ui/skeleton";
import React from "react";
import RenderLucide from "../../RenderLucide";

export const ProjectCardSkeleton = () => {
  return (
    <div className="relative p-4 min-h-34 max-h-34 min-w-48 max-w-48 cursor-pointer border text-nowrap rounded-md shadow-sm text-sm overflow-hidden animate-pulse">
      {/* header */}
      <header className="space-y-2 mb-4">
        <Skeleton className="h-6 w-3/4 rounded-md" /> {/* Simulated title */}
        <Skeleton className="h-4 w-1/2 rounded-md" /> {/* Simulated label */}
      </header>

      {/* Icon placeholder */}
      <Skeleton className="absolute -bottom-5 -right-5 w-24 h-24 opacity-30 rounded-full" />
    </div>
  );
};

export const ProjectCard = ({
  title,
  label,
  iconName,
}: {
  title: string;
  label: string;
  iconName?: string | null;
}) => {
  const icon = iconName || "File";

  return (
    <div className="relative p-4 min-h-34 max-h-34 min-w-48 max-w-48 cursor-pointer hover:scale-[1.05] transition-all duration-300 border text-nowrap rounded-md hover:mx-2 hover:bg-primary hover:text-primary-foreground hover:border-transparent shadow-sm text-sm overflow-hidden group/card">
      {/* header */}
      <header>
        <h1 className="font-header group-hover/card:opacity-100 transition-all duration-300 text-xl opacity-50">
          {title}
        </h1>
        <p className="text-sm opacity-50 group-hover/card:opacity-75 transition-all duration-300">
          {label}
        </p>
      </header>
      {/* Icon */}
      <RenderLucide
        iconName={icon}
        className="absolute group-hover/card:opacity-100 transition-all duration-300 -bottom-5 -right-5 w-24 h-24 opacity-30"
      />
    </div>
  );
};
