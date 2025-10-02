import React from "react";
import * as icons from "lucide-react";

export interface RenderLucideProps extends icons.LucideProps {
  iconName: string;
}

const RenderLucide = React.forwardRef<SVGSVGElement, RenderLucideProps>(
  ({ iconName, ...props }, ref) => {
    const Icon = (icons as unknown as Record<string, icons.LucideIcon>)[
      iconName
    ];

    return <Icon {...props} ref={ref} />;
  }
);

RenderLucide.displayName = "LucideIcon";

export default RenderLucide;
