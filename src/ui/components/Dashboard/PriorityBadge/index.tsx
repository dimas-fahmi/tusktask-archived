import { cn } from "@/src/ui/shadcn/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const PriorityBadgeVariants = cva("flex items-center rounded-md w-fit", {
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary/90 text-secondary-foreground",
      tertiary: "bg-accent text-accent-foreground",
      destructive: "bg-destructive text-destructive-foreground",
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

const priorityTitles = {
  low: "Low Priority",
  medium: "Normal Priority",
  high: "High Priority",
  urgent: "Urgent",
};

export interface PriorityBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof PriorityBadgeVariants> {
  priority?: keyof typeof priorityTitles;
}

const PriorityBadge = React.forwardRef<HTMLDivElement, PriorityBadgeProps>(
  ({ priority, className, variant, ...props }, ref) => {
    let variantToRender: VariantProps<typeof PriorityBadgeVariants>["variant"] =
      "tertiary";

    switch (priority) {
      case "low":
        variantToRender = "tertiary";
        break;
      case "medium":
        variantToRender = "secondary";
        break;
      case "high":
        variantToRender = "primary";
        break;
      case "urgent":
        variantToRender = "destructive";
        break;
      default:
        variantToRender = "tertiary";
        break;
    }

    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          ``,
          PriorityBadgeVariants({ variant: variant || variantToRender }),
          className,
        )}
      >
        {priorityTitles[priority || "medium"]}
      </div>
    );
  },
);

PriorityBadge.displayName = "PriorityBadge";

export default PriorityBadge;
