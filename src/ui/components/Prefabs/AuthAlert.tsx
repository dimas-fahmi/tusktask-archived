"use client";

import { CircleAlert, X } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  type ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import type React from "react";
import { cn } from "../../shadcn/lib/utils";

export const removeAlert = (
  params: ReadonlyURLSearchParams,
  router: AppRouterInstance,
  pathname: string,
) => {
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
  // Initalize Params, Router and Pathname
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Extract Params
  const code = params.get("code");
  const message = params.get("message");

  // Conditions
  const isError = !!code?.startsWith("success");

  return (
    <div
      className={cn(
        `${!code || !message ? "hidden" : "block"} ${isError ? "bg-destructive/20 text-destructive" : "bg-secondary text-secondary-foreground"} p-4 rounded-md`,
        className,
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
          type="button"
          className="cursor-pointer"
          onClick={() => {
            removeAlert(params, router, pathname);
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
