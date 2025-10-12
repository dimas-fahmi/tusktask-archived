import { cn } from "@/src/ui/shadcn/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { type LucideIcon, Tag } from "lucide-react";
import React from "react";

const projectBadgeVariants = cva("flex items-center rounded-md w-fit", {
  variants: {
    variant: {
      primary: "bg-primary/90 text-primary-foreground",
      secondary: "bg-secondary/90 text-secondary-foreground",
      tertiary: "bg-accent text-accent-foreground",
    },
    size: {
      xs: "text-xs p-2 gap-1",
      sm: "text-sm p-2 gap-1.5",
      base: "text-base px-4 py-2 gap-2",
      lg: "text-lg px-4 py-2 gap-2",
      xl: "text-xl px-4 py-2 gap-2",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "xs",
  },
});

export interface ProjectBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof projectBadgeVariants> {
  title: string;
  icon?: LucideIcon;
}

const ProjectBadge = React.forwardRef<HTMLDivElement, ProjectBadgeProps>(
  ({ title, icon, className, variant, ...props }, ref) => {
    const Icon = icon || Tag;

    return (
      <div
        ref={ref}
        {...props}
        className={cn(``, projectBadgeVariants({ variant }), className)}
      >
        <Icon className="w-4 h-4" />
        {title}
      </div>
    );
  },
);

ProjectBadge.displayName = "ProjectBadge";

export default ProjectBadge;
