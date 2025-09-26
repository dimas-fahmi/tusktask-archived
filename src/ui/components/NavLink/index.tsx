import Link from "next/link";
import React, { HTMLProps } from "react";
import { cn } from "../../shadcn/lib/utils";

export interface NavLinkProps extends HTMLProps<HTMLAnchorElement> {
  href: string;
}

const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        {...props}
        className={cn(
          `text-primary hover:underline visited:text-secondary visited:text-underline`,
          className
        )}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export default NavLink;
