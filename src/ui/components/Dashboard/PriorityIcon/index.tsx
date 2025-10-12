import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/ui/shadcn/lib/utils";

export const priorityIconVariants = cva("", {
  variants: {
    variant: {
      low: "bg-accent",
      medium: "bg-secondary",
      high: "bg-primary",
      urgent: "bg-destructive",
    },
  },
  defaultVariants: {
    variant: "low",
  },
});

export interface PriorityIconProps
  extends VariantProps<typeof priorityIconVariants> {
  className?: string;
}

const PriorityIcon = ({ variant, className }: PriorityIconProps) => {
  return (
    <div
      className={cn(
        `w-3 h-3 rounded-full`,
        priorityIconVariants({ variant }),
        className,
      )}
    />
  );
};

export default PriorityIcon;
