"use client";

import React from "react";
import { cn } from "../../shadcn/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CircleAlert, X } from "lucide-react";

const AuthAlert = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  // Extract Pathname
  const pathname = usePathname();

  // Extract Params
  const params = useSearchParams();
  const code = params.get("code");
  const message = params.get("message");

  // Conditions
  const isError = code?.includes("success") ? false : true;

  // Initialize Router
  const router = useRouter();

  return (
    <div
      className={cn(
        `${!code || !message ? "hidden" : "block"} ${isError ? "bg-destructive/20 text-destructive" : "bg-secondary text-secondary-foreground"} p-4 rounded-md`,
        className
      )}
    >
      {/* Header */}
      <header className="flex items-center justify-between">
        {/* Alert */}
        <div className="flex gap-2 items-center">
          {/* Icon */}
          <span>
            <CircleAlert />
          </span>

          {/* Message */}
          <span className="text-sm mt-1">{message}</span>
        </div>

        {/* Alert Dismiss Button */}
        <button
          className="cursor-pointer"
          onClick={() => {
            router.replace(pathname);
          }}
        >
          <X />
        </button>
      </header>

      {/* Children (optional) */}
      {children}
    </div>
  );
};

export default AuthAlert;
