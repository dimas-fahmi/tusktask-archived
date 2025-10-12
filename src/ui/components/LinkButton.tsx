import Link from "next/link";
import React from "react";
import { ArrowUpRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../shadcn/lib/utils";

export const linkButtonVariants = cva(
  "p-2 h-10 flex items-center justify-center bg-black text-white w-fit rounded-full",
  {
    variants: {
      variant: {
        primary: "bg-background text-primary-background",
        secondary: "bg-background text-secondary-background",
        tertiary: "bg-secondary-background text-secondary-foreground",
        quaternary: "bg-secondary-background text-primary-background",
        quinary: "bg-primary-background text-secondary-background",
        sexnary: "bg-primary-background text-secondary-foreground",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export interface LinkButtonProps
  extends React.HTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkButtonVariants> {
  label: string;
  href: string;
  labelClassName?: string;
  iconSize?: number;
}

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, label, labelClassName, variant, iconSize, ...props }, ref) => {
    return (
      <Link ref={ref} {...props} className="flex gap-2 items-center">
        {/* Icon */}
        <div className={cn(linkButtonVariants({ variant }), className)}>
          <ArrowUpRight size={iconSize ?? 22} />
        </div>

        {/* Label */}
        <div className={`flex items-center justify-center ${labelClassName}`}>
          {label}
        </div>
      </Link>
    );
  },
);

LinkButton.displayName = "LinkButton";

export default LinkButton;
