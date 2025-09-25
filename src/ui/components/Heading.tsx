import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "../shadcn/lib/utils";

// Variants
const headingVariants = cva(
  "p-2 tracking-wider text-3xl flex items-center justify-center rounded-lg w-fit",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        positive: "bg-secondary-foreground text-secondary-background",
        negative: "bg-secondary-background text-secondary-foreground",
      },
      size: {
        default: "text-3xl",
        sm: "text-xl",
        xs: "text-base",
        ss: "text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant, size, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn(headingVariants({ variant, size }), className)}
      {...props}
    />
  )
);

Heading.displayName = "Heading";
export default Heading;
