import React from "react";
import Heading from "./Heading";
import { cn } from "../shadcn/lib/utils";

export interface SectionHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  header: string;
  subtitle: string;
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, header, subtitle, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "md:flex items-center gap-4 text-center md:text-start",
          className,
        )}
      >
        <Heading className="mb-4 md:mb-0 mx-auto md:mx-0">{header}</Heading>
        <p className="max-w-[60ch] font-light">{subtitle}</p>
      </div>
    );
  },
);

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;
