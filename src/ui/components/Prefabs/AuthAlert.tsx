"use client";

import React from "react";
import { cn } from "../../shadcn/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CircleAlert, X } from "lucide-react";

export const removeAlert = () => {
  // Extract Params;
  const params = useSearchParams();

  // Initialize Router
  const router = useRouter();

  // Extract Pathname
  const pathname = usePathname();

  const nextParams = new URLSearchParams(params.toString());
  nextParams.delete("code");
  nextParams.delete("message");

  const nextSearch = nextParams.toString();
  router.replace(nextSearch ? `${pathname}?${nextSearch}` : pathname);
};

const AuthAlert = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  // Extract Params
  const params = useSearchParams();
  const code = params.get("code");
  const message = params.get("message");

  // Conditions
  const isError = code?.startsWith("success") ? false : true;

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
            removeAlert();
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
